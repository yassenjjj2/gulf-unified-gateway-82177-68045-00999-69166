import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { CheckCircle2, Download, Home, Share2 } from "lucide-react";

const PaymentReceiptPage = () => {
  const { id } = useParams();
  
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const cardLast4 = sessionStorage.getItem('cardLast4') || '****';
  const serviceName = customerInfo.service || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  const receiptId = `GF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        amount={customerInfo.amount || "500 ر.س"}
        title={`إيصال الدفع - ${serviceName}`}
        description={`تم الدفع بنجاح لخدمة ${serviceName}`}
      />
      <div 
        className="min-h-screen py-12" 
        dir="rtl"
        style={{
          background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
        }}
      >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Service Logo */}
          {branding.logo && (
            <div className="text-center mb-6">
              <img 
                src={branding.logo} 
                alt={serviceName}
                className="h-16 mx-auto mb-4"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in shadow-elevated"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
              }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">تم الدفع بنجاح!</h1>
            <p className="text-lg text-muted-foreground">
              شكراً لك، تم تأكيد حجزك
            </p>
          </div>
          
          <Card className="p-8 shadow-elevated">
            {/* Receipt Header */}
            <div className="text-center pb-6 border-b border-border mb-6">
              <Badge 
                className="text-sm px-4 py-2 mb-3"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                  color: 'white'
                }}
              >
                <CheckCircle2 className="w-4 h-4 ml-2" />
                <span>مدفوع</span>
              </Badge>
              
              <p className="text-sm text-muted-foreground">رقم الإيصال</p>
              <p className="text-2xl font-bold">
                {receiptId}
              </p>
            </div>
            
            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">الخدمة</span>
                <span className="font-semibold">{serviceName}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">الاسم</span>
                <span className="font-semibold">{customerInfo.name}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">البريد الإلكتروني</span>
                <span className="font-semibold">{customerInfo.email}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">رقم الهاتف</span>
                <span className="font-semibold">{customerInfo.phone}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">طريقة الدفع</span>
                <span className="font-semibold">
                  بطاقة •••• {cardLast4}
                </span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">التاريخ</span>
                <span className="font-semibold" dir="ltr">
                  {new Date().toLocaleDateString("ar-SA")}
                </span>
              </div>
              
              <div 
                className="flex justify-between py-4 rounded-lg px-4"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
                }}
              >
                <span className="text-lg font-bold">المبلغ المدفوع</span>
                <span className="text-2xl font-bold" style={{ color: branding.colors.primary }}>
                  {customerInfo.amount || "500 ر.س"}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1" variant="outline">
                <Download className="w-5 h-5 ml-2" />
                <span>تحميل الإيصال</span>
              </Button>
              
              <Button size="lg" className="flex-1" variant="outline">
                <Share2 className="w-5 h-5 ml-2" />
                <span>مشاركة</span>
              </Button>
            </div>
            
            <Button
              size="lg"
              className="w-full mt-4 text-white"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
              }}
              onClick={() => (window.location.href = "/")}
            >
              <Home className="w-5 h-5 ml-2" />
              <span>العودة للرئيسية</span>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-6">
              سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentReceiptPage;
