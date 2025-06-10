'use server'

import { prisma } from '@/common/configs/prisma'
import { emailTransporter } from '@/common/services/email'

export async function createApartmentInquiry(
  formData: FormData,
  apartmentId: string
) {
  return await prisma.$transaction(async (tx) => {
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const email = formData.get('email') as string
    const contactNumber = formData.get('contact_number') as string
    const visitationDate = formData.get('visitation_date') as string

    const exist = await tx.apartmentInquiry.findFirst({
      where: {
        firstName,
        lastName,
        email,
        contactNumber,
        apartmentId,
      },
    })

    if (exist) {
      await tx.apartmentInquiry.update({
        where: {
          id: exist.id,
        },
        data: {
          preferredVisitationDate: new Date(visitationDate),
        },
      })
      await sendEmail({
        firstName,
        lastName,
        email,
      })
      return { status: 200, message: 'Inquiry submitted successfully' }
    }

    await tx.apartmentInquiry.create({
      data: {
        firstName,
        lastName,
        email,
        contactNumber,
        apartmentId,
        preferredVisitationDate: new Date(visitationDate),
      },
    })

    await sendEmail({
      firstName,
      lastName,
      email,
    })

    return { status: 200, message: 'Inquiry submitted successfully' }
  })
}

function sendEmail(params: {
  email: string
  firstName: string
  lastName: string
}) {
  return emailTransporter.sendMail({
    from: 'noreply@loretotrading',
    sender: 'noreply@loretotrading',
    to: params.email,
    subject: `Thank you for sending us your inquiry.`,
    html: `
      <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
        <h1>Hi, <span style="text-transform: capitalize">${params.firstName} ${params.lastName}</span> 🎉 </h1>
        <p>
          We have receive your inquiry for the apartment. Our team will reach out to you via email or phone call as soon as possible. We can schedule your visitation and discuss about the apartment. Thank you.
        </p>
        <p>Best Regards,<br/> <strong>Loreto Trading</strong> </p>
      </div>
    `,
  })
}
