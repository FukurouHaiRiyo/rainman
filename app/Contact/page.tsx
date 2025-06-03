'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ref, push } from '@firebase/database';
import { db } from '@/app/lib/firebase';
import Link from 'next/link';

const ContactUs = () => {
  const { toast } = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allFieldsFilled = Object.values(form).every((v) => v.trim() !== '');
    if (!allFieldsFilled) {
      toast({
        title: 'Eroare',
        description: 'Te rugăm să completezi toate câmpurile.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await push(ref(db, 'Messages'), {
        ...form,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Mesaj trimis',
        description: 'Mesajul a fost transmis cu succes.',
      });

      setForm({
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Firebase error:', error);
      toast({
        title: 'Eroare',
        description: 'A apărut o eroare la trimiterea mesajului.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-background text-foreground">
      <div className="container grid md:grid-cols-2 gap-10 shadow-lg rounded-2xl bg-card">
        {/* Contact form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ia legătura cu <span className="text-primary">noi</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Completează formularul pentru a programa o consultație. Te vom contacta în cel mai scurt timp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Prenume"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nume"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
              />
            </div>

            <input
              type="email"
              name="emailAddress"
              placeholder="Adresă de email"
              value={form.emailAddress}
              onChange={handleChange}
              required
              className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Număr de telefon"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subiect"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
            />

            <textarea
              name="message"
              placeholder="Mesajul tău"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded border bg-background px-4 py-3 text-sm outline-none border-border"
              rows={4}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-6 py-3 w-full transition"
            >
              {isSubmitting ? 'Se trimite...' : 'Trimite mesaj'}
            </button>
          </form>

          <div className="text-sm text-muted-foreground mt-6">
            Sau contactează-ne direct la:
            <ul className="mt-2 space-y-1">
              <li>Email: <Link href="mailto:andreipanait00@gmail.com" className="text-primary">andreipanait00@gmail.com</Link></li>
              <li>Telefon: <Link href="tel:+40775341172" className="text-primary">+40775341172</Link></li>
            </ul>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-[400px] md:h-auto">
          <iframe
            src="https://maps.google.com/maps?q=ploiesti%20mihai%20bravu&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full rounded-b-lg md:rounded-b-none md:rounded-r-lg"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
