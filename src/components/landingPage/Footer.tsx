export default function Footer() {
  return (
    <section className='bg-black py-16 text-white sm:py-20'>
      <TwoColumnFooter />
    </section>
  )
}

const navigation = {
  connect: [
    { name: 'Book Meeting', href: '' },
    {
      name: 'Twitter',
      href: 'https://twitter.com/justansub',
    },
    {
      name: 'Github',
      href: 'https://www.youtube.com/@SpeedyBrand-SEO',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/speedy-brand-inc/',
    },
  ],
  company: [
    { name: 'Blogs', href: '/' },
    { name: 'Pricing', href: '/' },
    { name: 'Affiliate Partner', href: '/' },
    { name: 'AI For Enterprise', href: '/' },
  ],
}

const TwoColumnFooter = () => {
  return (
    <footer className='font-inter w-full'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col justify-between gap-12 lg:flex-row lg:gap-16'>
          <div className='space-y-8'>
            <img
              width={100}
              height={40}
              src='/images/syntaxUI.svg'
              alt='logo'
              className='h-7 w-auto invert'
            />
            <p className='text-md max-w-xs leading-6 text-gray-300'>
              Not your average component library - build faster, launch sooner.
            </p>
            <div className='flex space-x-6 text-sm text-gray-300'>
              <div>Made with ❤️ by Ansub.</div>
            </div>
          </div>

          {/* Navigations */}
          <div className='grid grid-cols-2 gap-10 sm:gap-14'>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-white/90'>
                Connect
              </h3>
              <div className='mt-6 space-y-4'>
                {navigation.connect.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      target='_blank'
                      rel='noreferrer'
                      className='text-sm leading-6 text-gray-300 hover:text-white'
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-sm font-semibold leading-6 text-white/90'>
                Company
              </h3>
              <div className='mt-6 space-y-4'>
                {navigation.company.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className='text-sm leading-6 text-gray-300 hover:text-white'
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24'>
          <p className='text-xs leading-5 text-gray-400'>
            &copy; 2024 SyntaxUI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
