import banner from '../assets/banner.png'

export default function Banner() {
  return (
    <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden shadow">
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${banner})`, backgroundColor: '#0f172a' }}
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/30 to-transparent" />

      <div className="relative z-10 flex flex-col items-start justify-center gap-3 h-full max-w-7xl mx-auto px-6">
        <div className="text-[#1ABC9C]">
          <h2 className="text-2xl md:text-4xl font-bold">Aprenda novas habilidades</h2>
          <p className="mt-2 text-sm md:text-base">Cursos selecionados para você</p>
        </div>
      </div>
    </section>
  )
}
