import Image from 'next/image'

export function C3PayLogo() {
  return (
    <Image
      src="/c3-pay-edenred-logo.png"
      alt="C3 Pay by Edenred"
      width={220}
      height={110}
      className="h-16 w-auto"
      priority
    />
  )
}
