export default function Home() {
  return (
    <main className="bg-[#111111] h-full justify-center flex p-2 flex-col items-center">
      <section className="text-white flex flex-col items-center text-center justify-center gap-5">
        <header>
          <h1 className="text-6xl font-bold mb-2">Start with a audio.</h1>
          <p className="text-white/95">Upload a file and use the power of AI to transcribe, summarize, and ask questions about related audio.</p>
        </header>
        <form className="flex gap-3 w-full">
          <input type="file" className="bg-white py-2 px-6 rounded-md text-black w-full hover:bg-gray-100"/>
          <button type="submit" className="bg-sky-400 py-2 px-6 rounded-md text-black hover:bg-sky-400/95">Upload</button>
        </form>
      </section>
    </main>
  )
}
