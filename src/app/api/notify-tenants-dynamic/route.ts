import { prisma } from '@/common/configs/prisma'
import { TenantStatus } from '@/common/enums/enums.db'
import { emailTransporter } from '@/common/services/email'
import { contact } from '@/lib/constants'
import { formatDate } from 'date-fns'

export async function GET() {
  const activeTenants = await prisma.tenant.findMany({
    where: {
      status: {
        in: [TenantStatus.Active, TenantStatus.Due],
      },
    },
  })

  const dateToday = new Date().getDate()

  await Promise.all(
    activeTenants.map(async (tenant) => {
      const isTwoDaysBeforeDue = tenant.monthlyDueDate - dateToday === 2
      if (isTwoDaysBeforeDue && tenant.status !== TenantStatus.Due) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            status: TenantStatus.Due,
          },
        })

        const formattedDueDate = formatDate(
          `${new Date().getFullYear()}/${new Date().getMonth()}/${
            tenant.monthlyDueDate
          }`,
          'MMM d, yyyy'
        )

        emailTransporter.sendMail({
          from: 'noreply@loretotrading',
          sender: 'noreply@loretotrading',
          to: tenant.emailAddress,
          subject: `A friendly reminder for your monthly rental payment.`,
          html: `
          <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
            <h2>Hi, <span style="text-transform: capitalize">${tenant.firstName} ${tenant.lastName}</span> </h2>
            <p>Your monthly due date is comming on ${formattedDueDate}. Please settle your monthly payment on or before the due date. Thank you.</p>
            <div>Best Regards,</div>
            <div><strong>Loreto Trading</strong> - ${contact}</div>
          </div>
        `,
        })
      }

      const dueToday = tenant.monthlyDueDate === dateToday
      if (dueToday && tenant.status !== TenantStatus.Due) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            status: TenantStatus.Due,
          },
        })

        emailTransporter.sendMail({
          from: 'noreply@loretotrading',
          sender: 'noreply@loretotrading',
          to: tenant.emailAddress,
          subject: `A friendly reminder for your monthly rental payment.`,
          html: `
              <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
                <h2>Hi, <span style="text-transform: capitalize">${tenant.firstName} ${tenant.lastName}</span> </h2>
                <p>Hope this message finds you well. Your monthly rental payment is due today.</p>
                <div>Best Regards,</div>
                <div><strong>Loreto Trading</strong> - ${contact}</div>
              </div>
            `,
        })
      }
    })
  )

  return Response.json({
    message: 'Notifications sent.',
    dateToday,
    activeTenants,
  })
}
