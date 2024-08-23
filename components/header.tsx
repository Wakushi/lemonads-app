import { comfortaa } from "@/lib/fonts"
import { LiaLemon } from "react-icons/lia"

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-amber-500">
      <Logo />
    </header>
  )
}

function Logo() {
  return (
    <div
      className={`${comfortaa.className} flex text-2xl font-semibold text-white items-center`}
    >
      <span>Lem</span>
      <LiaLemon />
      <span>nads</span>
    </div>
  )
}
