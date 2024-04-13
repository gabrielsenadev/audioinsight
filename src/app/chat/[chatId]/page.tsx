export const runtime = 'edge';

export default function Home() {
  return (
    <main className="bg-[#111111] h-full justify-center flex p-2 flex-col items-center">
      <section className="w-[90%] h-[90%] bg-slate-100 rounded-3xl p-10 flex justify-between flex-col transition-all items-center">
        <header className="self-start">
          <h1 className="text-4xl font-bold mb-2">Chat title</h1>
        </header>
        <section>
          audio track here
        </section>
        <section className="h-full w-[750px] max-w-full">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div>png</div>
              <span>User</span>
            </div>
            <p>text user here....</p>
          </div>
        </section>
        <section className="flex flex-col items-center">
          <form className="w-[750px] max-w-full">
            <input type="text" className="w-full rounded-md p-2 bg-black text-white placeholder:text-white/95" placeholder="Ask questions here"/>
          </form>
        </section>
      </section>
    </main>
  )
}
