import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactInquiryRequest {
  name: string;
  email: string;
  company?: string;
  project?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const inquiryData: ContactInquiryRequest = await req.json();
    console.log("Received contact inquiry:", inquiryData);

    // Insert inquiry into database
    const { data: inquiry, error: insertError } = await supabase
      .from("contact_inquiries")
      .insert({
        name: inquiryData.name,
        email: inquiryData.email,
        company: inquiryData.company,
        project: inquiryData.project,
        budget: inquiryData.budget,
        timeline: inquiryData.timeline,
        message: inquiryData.message,
        status: "new"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Portfolio <noreply@resend.dev>",
      to: [inquiryData.email],
      subject: "Thank you for your inquiry - I'll get back to you soon!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Inquiry!</h2>
          <p>Hi ${inquiryData.name},</p>
          <p>Thank you for reaching out! I've received your message about:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Project:</strong> ${inquiryData.project || 'Not specified'}<br>
            <strong>Budget:</strong> ${inquiryData.budget || 'Not specified'}<br>
            <strong>Timeline:</strong> ${inquiryData.timeline || 'Not specified'}
          </div>
          <p>I'll review your request and respond within 24 hours. In the meantime, feel free to:</p>
          <ul>
            <li>Check out my latest projects on my portfolio</li>
            <li>Schedule a direct meeting if you prefer face-to-face discussion</li>
            <li>Connect with me on LinkedIn</li>
          </ul>
          <p>Looking forward to discussing your project!</p>
          <p>Best regards,<br>Your Portfolio Team</p>
        </div>
      `,
    });

    // Send notification email to portfolio owner (you)
    const adminEmailResponse = await resend.emails.send({
      from: "Portfolio Notifications <noreply@resend.dev>",
      to: ["your-email@example.com"], // Replace with your actual email
      subject: `New Portfolio Inquiry from ${inquiryData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Inquiry</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Name:</strong> ${inquiryData.name}<br>
            <strong>Email:</strong> ${inquiryData.email}<br>
            <strong>Company:</strong> ${inquiryData.company || 'Not provided'}<br>
            <strong>Project:</strong> ${inquiryData.project || 'Not specified'}<br>
            <strong>Budget:</strong> ${inquiryData.budget || 'Not specified'}<br>
            <strong>Timeline:</strong> ${inquiryData.timeline || 'Not specified'}<br>
          </div>
          <h4>Message:</h4>
          <p style="background: #fff; padding: 15px; border-left: 4px solid #007cba;">
            ${inquiryData.message || 'No message provided'}
          </p>
          <p><strong>Inquiry ID:</strong> ${inquiry.id}</p>
          <p><em>Reply to this email to respond directly to the client. The system will track your response.</em></p>
        </div>
      `,
    });

    // Log notifications
    await supabase.from("notifications").insert([
      {
        recipient_email: inquiryData.email,
        type: "inquiry_received",
        subject: "Thank you for your inquiry - I'll get back to you soon!",
        content: "Confirmation email sent to client",
        related_inquiry_id: inquiry.id
      }
    ]);

    console.log("Client email sent:", clientEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inquiryId: inquiry.id,
        message: "Inquiry received and confirmations sent"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in contact-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);