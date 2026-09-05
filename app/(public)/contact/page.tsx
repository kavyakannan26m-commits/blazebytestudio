'use client';

import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const schema = z.object({
	name: z.string().trim().min(2, 'Enter your name.'),
	email: z.string().trim().email('Enter a valid email.'),
	phone: z.string().trim().min(7, 'Enter a valid phone number.'),
	subject: z.string().trim().min(3, 'Enter a subject.'),
	message: z.string().trim().min(10, 'Please add a little more detail.'),
	privacy_consent: z.literal(true, { error: 'Please accept the privacy policy.' }),
});

function createReferenceNumber() {
	return `BB-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export default function Contact() {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle');
	const [submitting, setSubmitting] = useState(false);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const values = Object.fromEntries(new FormData(form));
		const result = schema.safeParse({
			...values,
			privacy_consent: values.privacy_consent === 'on',
		});

		if (!result.success) {
			const nextErrors: Record<string, string> = {};
			result.error.issues.forEach((issue) => {
				nextErrors[String(issue.path[0])] = issue.message;
			});
			setErrors(nextErrors);
			setStatus('idle');
			return;
		}

		setErrors({});
		setStatus('idle');
		setSubmitting(true);

		try {
			const supabase = createSupabaseBrowserClient();
			const { error } = await supabase.from('customer_requests').insert({
				reference_number: createReferenceNumber(),
				request_type: 'enquiry',
				name: result.data.name,
				email: result.data.email,
				phone: result.data.phone,
				subject: result.data.subject,
				message: result.data.message,
				quoted_price: 'No pricing',
				privacy_consent: true,
			});

			if (error) throw error;
			form.reset();
			setStatus('success');
		} catch {
			setStatus('failure');
		} finally {
			setSubmitting(false);
		}
	}

	return <div className="section"><div className="container grid gap-12 md:grid-cols-2"><div><p className="eyebrow">Contact</p><h1 className="section-title">Let's talk.</h1><p className="mt-6 text-lg leading-8 text-slate-400">Questions about courses, partnerships or learning support? Send an enquiry.</p></div><form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[.03] p-7">{status === 'success' && <p className="mb-5 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">Thanks, your enquiry has been sent.</p>}{status === 'failure' && <p className="mb-5 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200">We could not send your enquiry. Please try again.</p>}{[['name','Name'],['email','Email'],['phone','Phone'],['subject','Subject']].map(([name,label]) => <label key={name} className="mb-4 block text-sm">{label}<input name={name} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-300" />{errors[name] && <span className="mt-1 block text-xs text-rose-300">{errors[name]}</span>}</label>)}<label className="block text-sm">Message<textarea name="message" rows={6} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-300" />{errors.message && <span className="mt-1 block text-xs text-rose-300">{errors.message}</span>}</label><label className="mt-4 flex items-start gap-3 text-sm text-slate-300"><input name="privacy_consent" type="checkbox" className="mt-1 accent-cyan-300" /> <span>I agree to the privacy policy.</span></label>{errors.privacy_consent && <span className="mt-1 block text-xs text-rose-300">{errors.privacy_consent}</span>}<button type="submit" disabled={submitting} className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Sending...' : 'Send enquiry'}</button></form></div></div>;
}
