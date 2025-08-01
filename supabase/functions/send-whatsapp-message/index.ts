import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessageRequest {
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { requestId }: WhatsAppMessageRequest = await req.json();

    // Get procurement request details with related data
    const { data: request, error: requestError } = await supabase
      .from('procurement_requests')
      .select(`
        *,
        item:items(name, unit, description),
        supplier:suppliers(name, whatsapp, contact_person)
      `)
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      throw new Error('Procurement request not found');
    }

    const { item, supplier } = request;
    
    if (!supplier?.whatsapp) {
      throw new Error('Supplier WhatsApp number not found');
    }

    // Format the message
    const message = `
🏫 *School Store Procurement Request*

Hello ${supplier.contact_person || supplier.name},

We need the following item:

📦 *Item:* ${item.name}
📏 *Unit:* ${item.unit}
🔢 *Quantity:* ${request.quantity}
${item.description ? `📝 *Description:* ${item.description}\n` : ''}
${request.unit_price ? `💰 *Expected Unit Price:* KSH ${request.unit_price}\n` : ''}
${request.required_date ? `📅 *Required Date:* ${new Date(request.required_date).toLocaleDateString()}\n` : ''}
${request.notes ? `📋 *Notes:* ${request.notes}\n` : ''}

Please confirm availability and provide:
- Current unit price
- Delivery timeline
- Any specifications

Thank you for your service!

*School Store Management*
    `.trim();

    // In a real implementation, you would integrate with WhatsApp Business API
    // For demo purposes, we'll just log the message and mark as sent
    console.log(`WhatsApp message for ${supplier.whatsapp}:`, message);
    
    // Simulate sending message (replace with actual WhatsApp API call)
    const whatsappSuccess = true; // In real implementation, check API response
    
    if (whatsappSuccess) {
      // Update the procurement request to mark WhatsApp as sent
      const { error: updateError } = await supabase
        .from('procurement_requests')
        .update({
          whatsapp_sent: true,
          whatsapp_sent_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating request:', updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'WhatsApp message sent successfully',
          recipient: supplier.whatsapp,
          content: message
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } else {
      throw new Error('Failed to send WhatsApp message');
    }
  } catch (error: any) {
    console.error('Error in send-whatsapp-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);