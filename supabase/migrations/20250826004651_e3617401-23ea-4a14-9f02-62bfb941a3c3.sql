-- Create contact_inquiries table for storing all contact form submissions
CREATE TABLE public.contact_inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    project TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    responded_at TIMESTAMP WITH TIME ZONE,
    response_message TEXT
);

-- Create meeting_requests table for scheduling system
CREATE TABLE public.meeting_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    meeting_type TEXT NOT NULL,
    proposed_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    agenda TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    approved_date TIMESTAMP WITH TIME ZONE,
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table for tracking sent notifications
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('inquiry_received', 'inquiry_response', 'meeting_request', 'meeting_approved', 'meeting_rejected')),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    related_inquiry_id UUID REFERENCES public.contact_inquiries(id),
    related_meeting_id UUID REFERENCES public.meeting_requests(id)
);

-- Enable RLS on all tables
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for submissions)
CREATE POLICY "Anyone can insert contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert meeting requests" 
ON public.meeting_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create policies for reading (admin only - we'll handle this in edge functions)
CREATE POLICY "Admin can view all inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (false); -- Will be handled via edge functions with service role

CREATE POLICY "Admin can view all meeting requests" 
ON public.meeting_requests 
FOR SELECT 
USING (false); -- Will be handled via edge functions with service role

-- Create policies for updates (admin only)
CREATE POLICY "Admin can update inquiries" 
ON public.contact_inquiries 
FOR UPDATE 
USING (false); -- Will be handled via edge functions with service role

CREATE POLICY "Admin can update meeting requests" 
ON public.meeting_requests 
FOR UPDATE 
USING (false); -- Will be handled via edge functions with service role

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contact_inquiries_updated_at
    BEFORE UPDATE ON public.contact_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_requests_updated_at
    BEFORE UPDATE ON public.meeting_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX idx_meeting_requests_status ON public.meeting_requests(status);
CREATE INDEX idx_meeting_requests_proposed_date ON public.meeting_requests(proposed_date);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_sent_at ON public.notifications(sent_at DESC);