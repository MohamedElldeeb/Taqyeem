/**
 * Taqyeem Luxury Email Templates
 * Responsive, cross-client HTML email templates for merchant notifications.
 */

export interface TestimonialReadyEmailProps {
  businessName: string
  customerName?: string | null
  rating: number
  reviewText: string
  imageUrl: string
  slug?: string | null
  dashboardUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  whatsappUrl?: string
}

export const OFFICIAL_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/taqyeem.site?stkn=MXRkazMwb3N3c2h1Ng==',
  facebook: 'https://www.facebook.com/share/18Vb2gQpWY/',
  whatsapp: 'https://wa.me/201066597793',
  site: 'https://taqyeem.site',
}

export function generateTestimonialReadyEmailHtml({
  businessName,
  customerName,
  rating,
  reviewText,
  imageUrl,
  slug,
  dashboardUrl = 'https://taqyeem.site/dashboard',
  instagramUrl = OFFICIAL_SOCIAL_LINKS.instagram,
  facebookUrl = OFFICIAL_SOCIAL_LINKS.facebook,
  whatsappUrl = OFFICIAL_SOCIAL_LINKS.whatsapp,
}: TestimonialReadyEmailProps): string {
  const safeRating = Math.max(1, Math.min(5, Math.round(rating || 5)))
  const ratingStars = '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating)
  const customerLabel = customerName?.trim() || 'عميل مُميز'
  const customerInitial = customerLabel.charAt(0) || 'ع'
  const wallUrl = slug ? `https://taqyeem.site/w/${slug}` : dashboardUrl

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تقييم جديد جاهز للمشاركة | Taqyeem</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #0f172a; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 24px 20px 24px; text-align: center; background: linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 60%, #ffffff 100%); border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <!-- Brand Squircle Logo -->
                    <div style="display: inline-block; vertical-align: middle; width: 44px; height: 44px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 14px; text-align: center; line-height: 44px; color: #ffffff; font-size: 26px; font-weight: 900; font-family: Georgia, serif; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">
                      “
                    </div>
                    <div style="display: inline-block; vertical-align: middle; text-align: right; margin-right: 12px;">
                      <div style="font-size: 20px; font-weight: 900; color: #0f172a; line-height: 1.2;">
                        تقييم <span style="font-size: 13px; font-weight: 700; color: #64748b;">· Taqyeem</span>
                      </div>
                      <div style="font-size: 11px; font-weight: 800; color: #059669; letter-spacing: 0.2px;">
                        منصة التقييمات الذكية للمتاجر
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 800; color: #047857;">
                      ✨ تم إنشاء تصميم تسويقي جديد بنجاح
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 24px 24px 24px;">
              
              <!-- Greeting & Announcement -->
              <h1 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.4;">
                مرحبًا ${businessName} 👋
              </h1>
              <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
                وصلك تقييم جديد من أحد عملائك، وتم تحويله تلقائياً لتصميم احترافي بهوية متجرك جاهز للمشاركة لجذب مشترين جدد:
              </p>

              <!-- Review Summary Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 22px;">
                <tr>
                  <td>
                    <!-- Customer Info Header -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                      <tr>
                        <td style="vertical-align: middle;">
                          <div style="display: inline-block; vertical-align: middle; width: 32px; height: 32px; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); border-radius: 10px; color: #ffffff; text-align: center; line-height: 32px; font-size: 13px; font-weight: 800; margin-left: 8px;">
                            ${customerInitial}
                          </div>
                          <div style="display: inline-block; vertical-align: middle;">
                            <span style="font-size: 14px; font-weight: 800; color: #0f172a;">${customerLabel}</span>
                          </div>
                        </td>
                        <td align="left" style="vertical-align: middle;">
                          <div style="display: inline-block; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 3px 8px; font-size: 12px; font-weight: 800; color: #b45309;">
                            <span style="color: #f59e0b; font-size: 14px;" dir="ltr">${ratingStars}</span>
                            <span style="margin-right: 4px; font-family: monospace;">(${safeRating}/5)</span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Review Text Quote -->
                    <div style="background-color: #ffffff; border-right: 3px solid #059669; border-radius: 8px; padding: 12px 14px; font-size: 14px; color: #1e293b; line-height: 1.65; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                      “${reviewText}”
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Generated Image Showcase -->
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 8px;">
                  🎨 التصميم التسويقي المولد لمتجرك (4K UHD):
                </div>
                <div style="border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); background-color: #04120f;">
                  <img src="${imageUrl}" alt="تصميم التقييم" style="width: 100%; max-width: 490px; height: auto; display: block; margin: 0 auto; border: 0;" />
                </div>
              </div>

              <!-- Primary CTA Action Buttons -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${wallUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px 24px; border-radius: 14px; text-align: center; box-shadow: 0 6px 18px rgba(5, 150, 105, 0.35); letter-spacing: 0.2px;">
                      🚀 عرض في صفحة متجرك (Wall of Love)
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; color: #059669; text-decoration: none; font-size: 13px; font-weight: 700; padding: 6px 12px;">
                      الانتقال إلى لوحة التحكم الرئيسية ←
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Marketing Tip Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ecfdf5; border: 1px dashed #6ee7b7; border-radius: 14px; padding: 12px 14px; margin-bottom: 8px;">
                <tr>
                  <td style="font-size: 12px; color: #065f46; line-height: 1.6;">
                    <strong>💡 نصيحة تسويقية سريعة:</strong> انشر صورة هذا التقييم في ستوري إنستجرام أو أرسلها للعملاء المترددين على واتساب لزيادة نسبة إتمام الشراء وثقة المتسوقين!
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer with Social Links -->
          <tr>
            <td style="padding: 22px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              
              <!-- Social Channels Icons -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 12px auto;">
                <tr>
                  <td style="padding: 0 6px;">
                    <a href="${instagramUrl}" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px; text-align: center; line-height: 34px; color: #db2777; text-decoration: none; font-size: 12px; font-weight: 800;">
                      IG
                    </a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="${facebookUrl}" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; text-align: center; line-height: 34px; color: #2563eb; text-decoration: none; font-size: 12px; font-weight: 800;">
                      FB
                    </a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; text-align: center; line-height: 34px; color: #059669; text-decoration: none; font-size: 12px; font-weight: 800;">
                      WA
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #475569;">
                منصة تقييم · Taqyeem Platform
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © 2026 جميع الحقوق محفوظة · صُنع لخدمة التجار والشركات الناشئة
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
