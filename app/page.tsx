import { Button } from "@/components/ui/button"
import { FaBullhorn, FaCheckCircle, FaRocket } from "react-icons/fa"
import { FaArrowTrendUp } from "react-icons/fa6"

import Link from "next/link"
import { UserType } from "@/lib/types/user.type"

export default function Home() {
  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-cente">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center text-center h-[100vh] px-6">
        <h1 className="text-7xl font-extrabold mb-6">
          Decentralize Your Ad Campaigns
        </h1>
        <p className="text-2xl max-w-3xl mb-12">
          Unlock the potential of direct, automated ad placements with Lemonads,
          the blockchain platform that removes intermediaries from your
          advertising strategy.
        </p>
        <div className="flex gap-6">
          <Link
            href={`/signup?type=${UserType.PUBLISHER}`}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-brand text-white hover:bg-white hover:text-brand shadow-md"
          >
            Start as Publisher
          </Link>
          <Link
            href={`/signup?type=${UserType.ANNOUNCER}`}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-brand text-white hover:bg-white hover:text-brand shadow-md"
          >
            Start as Advertiser
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <FaCheckCircle className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Targeted Reach</h3>
            <p className="text-gray-600">
              Precisely target your audience based on demographics, location,
              and interests to maximize the effectiveness of your ad campaigns.
            </p>
          </div>
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <FaCheckCircle className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Monitor your campaigns in real-time with detailed analytics and
              insights to make data-driven decisions.
            </p>
          </div>
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <FaCheckCircle className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Leverage blockchain technology for secure, transparent, and
              efficient transactions without intermediaries.
            </p>
          </div>
        </div>
      </section>

      {/* Why Use Lemonads Section */}
      <section className="w-full max-w-7xl mx-auto py-20 px-10 bg-white text-center">
        <h2 className="text-4xl font-bold mb-12">Why Use Lemonads?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-lg">
            <FaArrowTrendUp className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Drive E-commerce Growth
            </h3>
            <p className="text-gray-600">
              Boost your online sales with precision-targeted ads that reach the
              right audience, driving conversions and increasing revenue.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-lg">
            <FaBullhorn className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Enhance Brand Awareness
            </h3>
            <p className="text-gray-600">
              Amplify your brand’s presence with our platform’s advanced
              targeting options, ensuring your message resonates with your ideal
              audience.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-lg">
            <FaRocket className="text-brand text-4xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Accelerate Lead Generation
            </h3>
            <p className="text-gray-600">
              Supercharge your lead generation campaigns by connecting with
              high-intent users who are ready to convert.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Join thousands of marketers and publishers who are achieving
          unprecedented results with Lemonads. Start your journey today!
        </p>
        <Button size="lg" className="bg-white text-brand hover:bg-gray-200">
          Start Free Trial
        </Button>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-8 bg-gray-800 text-white text-center">
        <p className="mb-4">© 2024 Lemonads. All rights reserved.</p>
        <div className="flex justify-center gap-4">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </footer>
    </main>
  )
}
