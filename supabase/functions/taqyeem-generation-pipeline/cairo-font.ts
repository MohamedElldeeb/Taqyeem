import opentype from "npm:opentype.js@1.3.4";

/**
 * Cairo (the typeface every approved testimonial template specifies) is
 * distributed by Google Fonts only as WOFF — no raw TTF/OTF is published
 * — and resvg-wasm's font loader only accepts raw SFNT bytes. Rather than
 * depending on a third-party TTF mirror, `woffToSfnt` decompresses the
 * WOFF's per-table zlib streams (WOFF1 uses plain zlib/RFC1950, which
 * Deno's built-in DecompressionStream("deflate") handles natively) and
 * reconstructs a standard SFNT at request time, so the font stays fully
 * self-contained with no external asset hosting of our own.
 */

async function inflateZlib(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("deflate");
  const writer = ds.writable.getWriter();
  writer.write(data);
  writer.close();
  const chunks: Uint8Array[] = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

async function woffToSfnt(woff: Uint8Array): Promise<Uint8Array> {
  const dv = new DataView(woff.buffer, woff.byteOffset, woff.byteLength);
  const signature = dv.getUint32(0, false);
  if (signature !== 0x774f4646) throw new Error("not a woff file");
  const flavor = dv.getUint32(4, false);
  const numTables = dv.getUint16(12, false);

  interface Entry {
    tag: number;
    offset: number;
    compLength: number;
    origLength: number;
    origChecksum: number;
  }
  const entries: Entry[] = [];
  let p = 44;
  for (let i = 0; i < numTables; i++) {
    entries.push({
      tag: dv.getUint32(p, false),
      offset: dv.getUint32(p + 4, false),
      compLength: dv.getUint32(p + 8, false),
      origLength: dv.getUint32(p + 12, false),
      origChecksum: dv.getUint32(p + 16, false),
    });
    p += 20;
  }

  const tableData: Uint8Array[] = [];
  for (const e of entries) {
    const compBytes = woff.slice(e.offset, e.offset + e.compLength);
    if (e.compLength === e.origLength) {
      tableData.push(compBytes);
    } else {
      const inflated = await inflateZlib(compBytes);
      if (inflated.length !== e.origLength) {
        throw new Error(
          `woff table 0x${e.tag.toString(16)} inflate size mismatch: got ${inflated.length}, expected ${e.origLength}`,
        );
      }
      tableData.push(inflated);
    }
  }

  const order = entries.map((_, i) => i).sort((a, b) => entries[a].tag - entries[b].tag);

  let entrySelector = 0;
  while (1 << (entrySelector + 1) <= numTables) entrySelector++;
  const searchRange = (1 << entrySelector) * 16;
  const rangeShift = numTables * 16 - searchRange;

  const headerSize = 12;
  const dirSize = numTables * 16;
  const paddedLengths: number[] = [];
  let bodySize = 0;
  for (const idx of order) {
    const padded = (tableData[idx].length + 3) & ~3;
    paddedLengths.push(padded);
    bodySize += padded;
  }

  const out = new Uint8Array(headerSize + dirSize + bodySize);
  const outDv = new DataView(out.buffer);

  outDv.setUint32(0, flavor, false);
  outDv.setUint16(4, numTables, false);
  outDv.setUint16(6, searchRange, false);
  outDv.setUint16(8, entrySelector, false);
  outDv.setUint16(10, rangeShift, false);

  let dirP = headerSize;
  let dataP = headerSize + dirSize;
  for (let k = 0; k < order.length; k++) {
    const idx = order[k];
    const e = entries[idx];
    outDv.setUint32(dirP, e.tag, false);
    outDv.setUint32(dirP + 4, e.origChecksum, false);
    outDv.setUint32(dirP + 8, dataP, false);
    outDv.setUint32(dirP + 12, e.origLength, false);
    out.set(tableData[idx], dataP);
    dataP += paddedLengths[k];
    dirP += 16;
  }

  return out;
}

// Static-weight Cairo WOFF files from Google Fonts (v31), matched by
// resvg via each font's own internal weight metadata once converted.
const CAIRO_BOLD_WOFF_URL =
  "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1c.woff";
const CAIRO_SEMIBOLD_WOFF_URL =
  "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hD45W1c.woff";

let cairoFontsPromise: Promise<Uint8Array[]> | null = null;
export async function getCairoFontBuffers(): Promise<Uint8Array[]> {
  if (!cairoFontsPromise) {
    cairoFontsPromise = (async () => {
      const [boldWoff, semiboldWoff] = await Promise.all([
        fetch(CAIRO_BOLD_WOFF_URL).then((r) => r.arrayBuffer()),
        fetch(CAIRO_SEMIBOLD_WOFF_URL).then((r) => r.arrayBuffer()),
      ]);
      const [bold, semibold] = await Promise.all([
        woffToSfnt(new Uint8Array(boldWoff)),
        woffToSfnt(new Uint8Array(semiboldWoff)),
      ]);
      return [bold, semibold];
    })();
  }
  return cairoFontsPromise;
}

// opentype.js is only used for text measurement (wrapping decisions), not
// rendering — the bold weight's metrics are a close enough proxy for
// wrapping regardless of which embedded weight resvg ultimately draws.
let measureFontPromise: Promise<opentype.Font> | null = null;
export async function getMeasureFont(cairoBuffers: Uint8Array[]): Promise<opentype.Font> {
  if (!measureFontPromise) {
    measureFontPromise = Promise.resolve(
      opentype.parse(
        cairoBuffers[0].buffer.slice(
          cairoBuffers[0].byteOffset,
          cairoBuffers[0].byteOffset + cairoBuffers[0].byteLength,
        ),
      ),
    );
  }
  return measureFontPromise;
}
