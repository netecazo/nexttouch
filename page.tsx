import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      <header style={{ background: 'linear-gradient(160deg, #eaf6f2, #fff 60%)' }}>
        <div className="max-w-6xl mx-auto px-7 py-6">
          <nav className="flex justify-between items-center mb-12">
            <div className="text-2xl font-bold">
              <span style={{ color: '#0b5d4b' }}>Next</span>
              <span style={{ color: '#f2994a' }}>Touch</span>
            </div>
            <Link 
              href="/login"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: '#0b5d4b' }}
            >
              Start free trial
            </Link>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-center pb-16">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Stop losing leads <span style={{ color: '#0b5d4b' }}>after the first reply.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                NextTouch reads your leads every morning and hands you the 10 people to contact today, 
                each with a personal text already written in your voice. Tap, tweak, send. No smart plans, 
                no tagging, no drip setup.
              </p>
              <Link 
                href="/login"
                className="inline-block px-8 py-4 rounded-lg font-semibold text-white text-lg transition-colors"
                style={{ backgroundColor: '#0b5d4b' }}
              >
                Try it free for 14 days
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Works with your CRM or a plain spreadsheet. Setup takes about 5 minutes.
              </p>
            </div>

            <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
              <div className="bg-gray-100 rounded-2xl p-5">
                <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                  Today · 10 follow-ups · ~12 min
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">Dana R. · Zillow lead</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                        Went quiet 9 days ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      &ldquo;Hi Dana! The 3-bed on Maple you liked just dropped $15k. Want me to set up a look this weekend?&rdquo;
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">Marcus T.</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        Open house
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      &ldquo;Great meeting you Sunday. You mentioned the yard mattered. Here are 2 new ones with big lots.&rdquo;
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">The Chens</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        90-day nurture
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      &ldquo;Quick check-in: still thinking spring for the move? Rates moved this week.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-7">
          <h2 className="text-4xl font-bold text-center mb-4">You already know this feeling</h2>
          <p className="text-center text-gray-300 mb-12 text-lg">Real things agents are saying right now:</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="mb-4 leading-relaxed">
                &ldquo;Sometimes it feels like one more complicated thing on my plate instead of something that makes life easier.&rdquo;
              </p>
              <p className="text-sm text-gray-400">A newer agent on r/realtors, about their CRM</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <p className="mb-4 leading-relaxed">
                &ldquo;a lot of conversations die before turning into a viewing or booked call.&rdquo;
              </p>
              <p className="text-sm text-gray-400">An agent on r/realtors, about Zillow and Facebook leads</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <p className="mb-4 leading-relaxed">
                &ldquo;Send listings + a CMA … Nah, I used someone else&rdquo;
              </p>
              <p className="text-sm text-gray-400">@Scallyhatagent on X</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-7">
          <h2 className="text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            It&apos;s built around one daily habit, not a complicated system you have to keep up.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white mb-4"
                style={{ backgroundColor: '#0b5d4b' }}>
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Connect your leads</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload a CSV or connect your CRM. NextTouch reads your notes, the last time you talked to each person, 
                and where each lead came from.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white mb-4"
                style={{ backgroundColor: '#0b5d4b' }}>
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Get your morning list</h3>
              <p className="text-gray-600 leading-relaxed">
                Every morning you get the 10 people most likely to go cold or ready to move, ranked, 
                with the reason for each one.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white mb-4"
                style={{ backgroundColor: '#0b5d4b' }}>
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Send in one tap</h3>
              <p className="text-gray-600 leading-relaxed">
                Each lead gets a draft text or email that mentions what they told you. You approve every message. 
                Nothing goes out automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#0b5d4b' }}>
        <div className="max-w-3xl mx-auto px-7 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Your next deal is probably already in your CRM.
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get tomorrow morning&apos;s list free.
          </p>
          <Link 
            href="/login"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            style={{ backgroundColor: '#f2994a', color: 'white' }}
          >
            Start free trial
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm">
        NextTouch · Real estate follow-up, simplified
      </footer>
    </div>
  );
}
