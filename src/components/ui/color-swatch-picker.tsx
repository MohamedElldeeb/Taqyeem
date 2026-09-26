import { Input } from '@/components/ui/input'

export const BRAND_COLOR_PRESETS = ['#A9431E', '#087F5B', '#5B4B8A', '#B7791F', '#171717']

export interface ColorSwatchPickerProps {
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

function ColorSwatchPicker({
  value,
  onChange,
  presets = BRAND_COLOR_PRESETS,
}: ColorSwatchPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          onClick={() => onChange(color)}
          className="size-8 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2"
          style={{
            backgroundColor: color,
            outline: value === color ? `2px solid ${color}` : undefined,
            outlineOffset: 2,
          }}
        />
      ))}
      <Input
        aria-label="لون العلامة التجارية (كود اللون)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-28"
      />
    </div>
  )
}

export { ColorSwatchPicker }
