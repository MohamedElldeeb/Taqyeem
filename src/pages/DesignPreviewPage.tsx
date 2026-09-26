import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

/**
 * Phase 1 foundation preview only.
 * Proves the design system (tokens, RTL, typography, primitives) renders
 * correctly. Not a product screen — temporary root route until the real
 * landing page (Phase 14) replaces it.
 */
function DesignPreviewPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-medium text-emerald">تقييم · Taqyeem</span>
          <h1 className="text-3xl font-semibold text-ink">أساس النظام التصميمي</h1>
          <p className="max-w-prose text-muted-text">
            هذه معاينة لعناصر الواجهة الأساسية فقط، للتأكد من الألوان والخطوط
            واتجاه الصفحة قبل بناء أي صفحة منتج فعلية.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>عنصر تجريبي</CardTitle>
            <CardDescription>بطاقة، أزرار، حقول إدخال، ووسم حالة.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>زر أساسي</Button>
              <Button variant="secondary">زر ثانوي</Button>
              <Button variant="outline">زر محدد</Button>
              <Button variant="ghost">زر شفاف</Button>
              <Badge>جديد</Badge>
              <Badge variant="secondary">قيد المعالجة</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">اسم العميل (اختياري)</Label>
              <Input id="name" placeholder="مثال: محمد أحمد" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="review">نص التقييم</Label>
              <Textarea id="review" placeholder="اكتب رأيك هنا..." />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

export default DesignPreviewPage
