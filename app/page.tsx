import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl md:text-6xl">
              Ingliz tili bilimlaringizni tekshiring
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-zinc-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Bolalar uchun maxsus tayyorlangan testlar orqali ingliz tili bilimlaringizni tekshiring va rivojlantiring.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
              <Button asChild variant="default" size="lg">
                <Link href="/auth/register">
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login">
                  Kirish
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-zinc-600 font-semibold tracking-wide uppercase">Xususiyatlar</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Nima uchun bizni tanlashingiz kerak?
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zinc-700 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <CardTitle>Turli darajadagi testlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500">Boshlang&apos;ichdan yuqori darajagacha bo&apos;lgan testlar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zinc-700 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Vaqt cheklovi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500">Real vaqtda test yechish imkoniyati</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zinc-700 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle>Natijalarni tahlil qilish</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500">Batafsil natijalar va tahlillar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zinc-700 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Tezkor natijalar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500">Test yakunlangandan so&apos;ng darhol natijalarni ko&apos;rish</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-zinc-600 font-semibold tracking-wide uppercase">Statistika</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Raqamlarda biz
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-zinc-700">5000+</div>
              <div className="mt-2 text-lg font-medium text-zinc-600">Faol o&apos;quvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-zinc-700">1000+</div>
              <div className="mt-2 text-lg font-medium text-zinc-600">Testlar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-zinc-700">98%</div>
              <div className="mt-2 text-lg font-medium text-zinc-600">Mamnun foydalanuvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-zinc-700">24/7</div>
              <div className="mt-2 text-lg font-medium text-zinc-600">Qo&apos;llab-quvvatlash</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-zinc-600 font-semibold tracking-wide uppercase">Fikrlar</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              O&apos;quvchilarimiz biz haqimizda
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-8">
                <p className="text-zinc-600 mb-4">&quot;Bu platforma orqali ingliz tilini o&apos;rganish juda qiziqarli va samarali bo&apos;ldi. Testlar orqali o&apos;z bilimlarimni muntazam tekshirib boraman.&quot;</p>
                <div className="font-medium text-zinc-900">Aziza Karimova</div>
                <div className="text-zinc-500">10-sinf o&apos;quvchisi</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8">
                <p className="text-zinc-600 mb-4">&quot;Audio materiallar va interaktiv mashqlar juda foydali. Platformadan foydalanganim uchun ingliz tilida gaplashish qobiliyatim sezilarli darajada oshdi.&quot;</p>
                <div className="font-medium text-zinc-900">Jamshid Aliyev</div>
                <div className="text-zinc-500">9-sinf o&apos;quvchisi</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8">
                <p className="text-zinc-600 mb-4">&quot;O&apos;quv materiallari juda tushunarli va qiziqarli tarzda tuzilgan. Har kuni yangi so&apos;zlarni o&apos;rganish va testlarni yechish menga katta zavq beradi.&quot;</p>
                <div className="font-medium text-zinc-900">Malika Rahimova</div>
                <div className="text-zinc-500">11-sinf o&apos;quvchisi</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Hoziroq boshlang
            </h2>
            <p className="mt-4 text-lg leading-6 text-zinc-300">
              Ingliz tili bilimlaringizni yangi bosqichga olib chiqish uchun bugun ro&apos;yxatdan o&apos;ting
            </p>
            <div className="mt-8">
              <Button asChild variant="secondary" size="lg">
                <Link href="/auth/register">
                  Bepul ro&apos;yxatdan o&apos;tish
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
