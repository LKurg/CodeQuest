import React from 'react'

function PreviewComponent() {
  return (
    <div>
     <>


  <header>
    {/* navbar start */}
    <div className="transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark lg:border-b border-borderColor dark:border-borderColor-dark">
      <nav>
        <div className="py-15px lg:py-0 px-15px container sm:container-fluid lg:container 3xl:container-secondary 4xl:container mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
            {/* navbar left */}
            <div className="lg:col-start-1 lg:col-span-2">
              <a href="index.html" className="block">
                <img
                  src="assets/images/logo/logo_1.png"
                  alt="Logo"
                  className="w-logo-sm lg:w-auto py-2"
                />
              </a>
            </div>
            {/* Main menu */}
            <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
              <ul className="nav-list flex justify-center">
         
             
                <li className="nav-item group">
                  <a
                    href="#"
                    className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
                  >
                    Pages
                    <i className="icofont-rounded-down" />
                  </a>
     
                </li>
                <li className="nav-item group">
                  <a
                    href="#"
                    className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
                  >
                    Courses
                    <i className="icofont-rounded-down" />
                  </a>
                  {/* dropdown menu */}
                  <div
                    className="dropdown absolute left-0 translate-y-10 z-medium hidden opacity-0"
                    style={{ transition: "0.3s" }}
                  >
                    <div className="container 3xl:container2-lg 4xl:container w-2000 shadow-dropdown px-30px mx-auto xl:px-30px py-30px rounded-standard bg-white dark:bg-whiteColor-dark">
                      <div className="grid grid-cols-4 gap-x-30px">
                        <div>
                          <h3 className="text-lg text-blackColor font-semibold border-b border-borderColor dark:text-blackColor-dark p-10px mb-10px">
                            Get Started 1
                          </h3>
                          <ul>
                            <li>
                              <a
                                href="course.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Grid
                                <span className="text-size-12 font-semibold text-primaryColor bg-whitegrey3 px-15px py-5px ml-5px rounded">
                                  All Courses
                                </span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Grid (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-grid.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Grid
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-grid-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Grid (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-list.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course List
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-list-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course List (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg text-blackColor font-semibold border-b border-borderColor dark:text-blackColor-dark p-10px mb-10px">
                            Get Started 2
                          </h3>
                          <ul>
                            <li>
                              <a
                                href="course-details.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Details (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-2.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Details 2
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-2-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Details 2 (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-3.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Coures Details 3
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-3-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Details 3 (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg text-blackColor font-semibold border-b border-borderColor dark:text-blackColor-dark p-10px mb-10px">
                            Get Started 3
                          </h3>
                          <ul>
                            <li>
                              <a
                                href="pages/dashboards/become-an-instructor.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Become An Instructor
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/create-course.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Careate Course
                                <span className="text-size-12 font-semibold text-primaryColor bg-whitegrey3 px-15px py-5px rounded">
                                  Career
                                </span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Instructor
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor-dark.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Instructor (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor-details.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Instructor Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="lesson.html"
                                className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor p-10px block hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-whiteColor dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                              >
                                Course Lesson
                                <span className="text-size-12 font-semibold text-secondaryColor bg-whitegrey3 px-15px py-5px ml-5px rounded">
                                  New
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* dropdown banner */}
                        <div>
                          <img
                            src="assets/images/mega/mega_menu_1.png"
                            alt="Mega Menu"
                            className="w-full rounded-standard"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="nav-item group relative">
                  <a
                    href="pages/dashboards/instructor-dashboard.html"
                    className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
                  >
                    Dashboard
                    <i className="icofont-rounded-down" />
                  </a>
                  {/* dropdown menu */}
                  <div
                    className="dropdown absolute left-0 translate-y-10 z-medium hidden opacity-0"
                    style={{ transition: "0.3s" }}
                  >
                    <div className="shadow-dropdown max-w-dropdown2 w-2000 py-14px rounded-standard bg-white dark:bg-whiteColor-dark">
                      <ul>
                  
                        <li className="relative group/nested">
                          <a
                            href="pages/dashboards/student-dashboard.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg flex justify-between items-center dark:bg-whiteColor-dark dark:text-contentColor-dark dark:hover:bg-whitegrey1-dark dark:hover:text-primaryColor"
                          >
                            Student <i className="icofont-rounded-right" />
                          </a>
                         
                    
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="nav-item group relative">
                  <a
                    href="pages/ecommerce/shop.html"
                    className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
                  >
                    eCommerce
                    <i className="icofont-rounded-down" />
                  </a>
                  {/* dropdown menu */}
                  <div
                    className="dropdown absolute left-0 translate-y-10 z-medium hidden opacity-0"
                    style={{ transition: "0.3s" }}
                  >
                    <div className="shadow-dropdown max-w-dropdown2 w-2000 py-14px rounded-standard bg-white dark:bg-whiteColor-dark">
                      <ul>
                        <li>
                          <a
                            href="pages/ecommerce/shop.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 block hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-contentColor-dark dark:hover:text-primaryColor dark:hover:bg-whitegrey1-dark"
                          >
                            Shop
                            <span className="text-size-12 font-semibold text-primaryColor bg-whitegrey3 px-15px py-5px rounded">
                              Online Store
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="pages/ecommerce/product-details.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 block hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-contentColor-dark dark:hover:text-primaryColor dark:hover:bg-whitegrey1-dark"
                          >
                            Product Details
                          </a>
                        </li>
                        <li>
                          <a
                            href="pages/ecommerce/cart.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 block hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-contentColor-dark dark:hover:text-primaryColor dark:hover:bg-whitegrey1-dark"
                          >
                            Cart
                          </a>
                        </li>
                        <li>
                          <a
                            href="pages/ecommerce/checkout.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 block hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-contentColor-dark dark:hover:text-primaryColor dark:hover:bg-whitegrey1-dark"
                          >
                            Checkout
                          </a>
                        </li>
                        <li>
                          <a
                            href="pages/ecommerce/wishlist.html"
                            className="text-sm 2xl:text-base font-semibold text-contentColor border-l-2 border-transparent transition duration-300 hover:border-primaryColor px-25px py-10px hover:bg-whitegrey1 block hover:text-primaryColor leading-sm lg:leading-lg 2xl:leading-lg dark:text-contentColor-dark dark:hover:text-primaryColor dark:hover:bg-whitegrey1-dark"
                          >
                            Wishlist
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
      
          </div>
        </div>
      </nav>
    </div>
    {/* navbar end */}
    {/* mobile menu */}
    <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
      <button className="close-mobile-menu text-lg bg-darkdeep1 hover:bg-secondaryColor text-white px-[11px] py-[6px] absolute top-0 right-full hidden">
        <i className="icofont icofont-close-line" />
      </button>
      {/* mobile menu wrapper */}
      <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
        {/* search input  */}
        <div className="pb-10 border-b border-borderColor dark:border-borderColor-dark">
          <form className="flex justify-between items-center w-full bg-whitegrey2 dark:bg-whitegrey2-dark px-15px py-[11px]">
            <input
              type="text"
              placeholder="Search entire store..."
              className="bg-transparent w-4/5 focus:outline-none text-sm text-darkdeep1 dark:text-blackColor-dark"
            />
            <button className="block text-lg text-darkdeep1 hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-secondaryColor">
              <i className="icofont icofont-search-2" />
            </button>
          </form>
        </div>
        {/* mobile menu accordions */}
        <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
          <ul className="accordion-container">
            <li className="accordion">
              {/* accordion header */}
              <div className="flex items-center justify-between">
                <a
                  className="leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="index.html"
                >
                  Home
                </a>
                <button className="accordion-controller px-3 py-4">
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                <div className="content-wrapper">
                  <ul className="accordion-container">
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="index.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Home Light
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="index.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Home (Default)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-2.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Elegant
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-3.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Classic
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-4.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Classic LMS
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-5.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Online Course
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-6.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Marketplace
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-7.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                University
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-8.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                ECommerce
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-9.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Kindergarten
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-10.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Machine Learning
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-11.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Single Course
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="index-dark.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Home Dark
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="index-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Home Default (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-2-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Elegant (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-3-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Classic (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-4-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Classic LMS (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-5-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Online Course (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-6-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Marketplace (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-7-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                University (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-8-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                ECommerce (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-9-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Kindergarten (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-10-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Machine Learning (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="home-11-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Single Course (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="accordion">
              {/* accordion header */}
              <div className="flex items-center justify-between">
                <a
                  className="leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="#"
                >
                  Pages
                </a>
                <button className="accordion-controller px-3 py-4">
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                <div className="content-wrapper">
                  <ul className="accordion-container">
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 1
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="about.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                About
                              </a>
                            </li>
                            <li>
                              <a
                                href="about-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                About (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="blog.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Block
                              </a>
                            </li>
                            <li>
                              <a
                                href="blog-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Block (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="blog-details.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Block Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="blog-details-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Block Details (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 2
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="error.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Error 404
                              </a>
                            </li>
                            <li>
                              <a
                                href="error-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Error (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="event-details.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Event Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/zoom/zoom-meetings.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Zoom
                                <span className="px-15px py-5px text-primaryColor bg-whitegrey3 text-xs rounded ml-5px">
                                  Online Call
                                </span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/zoom/zoom-meetings-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Zoom Meeting (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/zoom/zoom-meeting-details.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Zoom Meeting Details
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 3
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="pages/zoom/zoom-meeting-details-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Meeting Details (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="login.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Login
                              </a>
                            </li>
                            <li>
                              <a
                                href="login-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Login (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="maintenance.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Maintenance
                              </a>
                            </li>
                            <li>
                              <a
                                href="maintenance-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Maintenance (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Term &amp; Condition
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 4
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Term &amp; Condition (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Privacy Policy
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Privacy Policy (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Success Stories
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Success Stories (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Work Policy
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <a href="#" className="pl-15px pt-3 pb-7px">
                        <img
                          className="w-full"
                          src="assets/images/mega/mega_menu_2.png"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="accordion">
              {/* accordion header */}
              <div className="flex items-center justify-between">
                <a
                  className="leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="course.html"
                >
                  Courses
                </a>
                <button className="accordion-controller px-3 py-4">
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                <div className="content-wrapper">
                  <ul className="accordion-container">
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 1
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="course.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Grid
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Grid (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Grid
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-grid-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Grid (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-list.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course List
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-list-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course List (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 2
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="course-details.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Details (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-2.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Details 2
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-2-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Details 2 (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-3.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Details 3
                              </a>
                            </li>
                            <li>
                              <a
                                href="course-details-3-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Details 3 (Dark)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Get Started 3
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="pages/dashboards/become-an-instructor.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Become An Instructor
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/create-course.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Create Course
                                <span className="px-15px py-5px text-primaryColor bg-whitegrey3 text-xs rounded ml-5px">
                                  Career
                                </span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Instructor
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor-dark.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Instructor (Dark)
                              </a>
                            </li>
                            <li>
                              <a
                                href="instructor-details.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Instructor Details
                              </a>
                            </li>
                            <li>
                              <a
                                href="lesson.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Course Lesson
                                <span className="px-15px py-5px text-secondaryColor bg-whitegrey3 text-xs rounded ml-5px">
                                  New
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <a href="#" className="pl-15px pt-3 pb-7px">
                        <img
                          className="w-full"
                          src="assets/images/mega/mega_menu_1.png"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="accordion">
              {/* accordion header */}
              <div className="flex items-center justify-between">
                <a
                  className="leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="pages/dashboards/instructor-dashboard.html"
                >
                  Dashboard
                </a>
                <button className="accordion-controller px-3 py-4">
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                <div className="content-wrapper">
                  <ul className="accordion-container">
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/dashboards/admin-dashboard.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Admin
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="pages/dashboards/admin-dashboard.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Admin Dashboard
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-profile.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Admin Profile
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-message.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Message
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-course.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Courses
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-reviews.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Review
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-quiz-attempts.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Admin Quiz
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/admin-settings.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Settings
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/dashboards/instructor-dashboard.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Instructor
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="pages/dashboards/instructor-dashboard.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Inst. Dashboard
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-profile.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Inst. Profile
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-message.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Message
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-wishlist.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Wishlist
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-reviews.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Review
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-my-quiz-attempts.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                My Quiz
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-order-history.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Order History
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-course.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                My Courses
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-announcments.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Announcements
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-quiz-attempts.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Quiz Attempts
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-assignments.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Assignments
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/instructor-settings.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Settings
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="accordion">
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/dashboards/student-dashboard.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Student
                        </a>
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-300" />
                        </button>
                      </div>
                      {/* accordion content */}
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-300">
                        <div className="content-wrapper">
                          {/* Dropdown */}
                          <ul>
                            <li>
                              <a
                                href="pages/dashboards/student-dashboard.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Dashboard
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-profile.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Profile
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-message.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Message
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-enrolled-courses.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Enrolled Courses
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-wishlist.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Wishlist
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-reviews.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Review
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-my-quiz-attempts.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                My Quiz
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-assignments.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Assignment
                              </a>
                            </li>
                            <li>
                              <a
                                href="pages/dashboards/student-settings.html"
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Settings
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="accordion">
              {/* accordion header */}
              <div className="flex items-center justify-between">
                <a
                  className="leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="pages/ecommerce/shop.html"
                >
                  ECommerce
                </a>
                <button className="accordion-controller px-3 py-4">
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                  <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                <div className="content-wrapper">
                  <ul>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/ecommerce/shop.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Shop
                          <span className="px-15px py-5px text-primaryColor bg-whitegrey3 text-xs rounded ml-5px">
                            Online Store
                          </span>
                        </a>
                      </div>
                    </li>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/ecommerce/product-details.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Product Details
                        </a>
                      </div>
                      {/* accordion content */}
                    </li>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/ecommerce/cart.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Cart
                        </a>
                      </div>
                      {/* accordion content */}
                    </li>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/ecommerce/checkout.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Checkout
                        </a>
                      </div>
                      {/* accordion content */}
                    </li>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="pages/ecommerce/wishlist.html"
                          className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Wishlist
                        </a>
                      </div>
                      {/* accordion content */}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* my account accordion */}
        <div>
          <ul className="accordion-container mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
            <li className="accordion group">
              {/* accordion header */}
              <div className="accordion-controller flex items-center justify-between">
                <a
                  className="leading-1 text-darkdeep1 font-medium group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                  href="#"
                >
                  My Account
                </a>
                <button className="px-3 py-1">
                  <i className="icofont-thin-down text-size-15 text-darkdeep1 group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor" />
                </button>
              </div>
              {/* accordion content */}
              <div className="accordion-content h-0 overflow-hidden transition-all duration-500 shadow-standard">
                <div className="content-wrapper">
                  <ul>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center gap-1">
                        <a
                          href="login.html"
                          className="leading-1 text-darkdeep1 text-sm pl-30px pt-7 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          Login
                        </a>
                        <a
                          href="login.html"
                          className="leading-1 text-darkdeep1 text-sm pr-30px pt-7 pb-4 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          <span>/</span> Create Account
                        </a>
                      </div>
                    </li>
                    <li>
                      {/* accordion header */}
                      <div className="flex items-center justify-between">
                        <a
                          href="login.html"
                          className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          My Account
                        </a>
                      </div>
                      {/* accordion content */}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* Mobile menu social area */}
        <div>
          <ul className="flex gap-6 items-center mb-5">
            <li>
              <a className="facebook" href="#">
                <i className="icofont icofont-facebook text-fb-color dark:text-whiteColor dark:hover:text-secondaryColor" />
              </a>
            </li>
            <li>
              <a className="twitter" href="#">
                <i className="icofont icofont-twitter text-twiter-color dark:text-whiteColor dark:hover:text-secondaryColor" />
              </a>
            </li>
            <li>
              <a className="pinterest" href="#">
                <i className="icofont icofont-pinterest dark:text-whiteColor dark:hover:text-secondaryColor" />
              </a>
            </li>
            <li>
              <a className="instagram" href="#">
                <i className="icofont icofont-instagram dark:text-whiteColor dark:hover:text-secondaryColor" />
              </a>
            </li>
            <li>
              <a className="google" href="#">
                <i className="icofont icofont-youtube-play dark:text-whiteColor dark:hover:text-secondaryColor" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  {/* main body */}
  <main className="bg-transparent">
    <section>
      <div className="overflow-hidden relative z-0">
        {/* animated icons */}
        <div>
          <img
            src="assets/images/education/hero_shape2.png"
            className="absolute right-[16%] top-[60%] md:right-[31px] md:top-[70%] lg:right-[16%] lg:top-[60%] animate-move-var z-10"
            alt=""
          />
          <img
            src="assets/images/education/hero_shape3.png"
            className="absolute right-[9%] top-[58%] md:right-[12%] lg:right-[9%] animate-move-hor z-10"
            alt=""
          />
          <img
            src="assets/images/education/hero_shape4.png"
            className="absolute left-1/2 bottom-[15%] md:left-[4%] lg:left-1/2 animate-spin-slow"
            alt=""
          />
          <img
            src="assets/images/education/hero_shape5.png"
            className="absolute left-[53%] top-[41%] md:left-[9%] md:top-[43%] lg:left-[53%] animate-spin-slow"
            alt=""
          />
        </div>
        <div className="container pt-12 lg:pt-130px pb-175px relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 md:gap-15 lg:gap-30px">
            {/* banner Left */}
            <div className="lg:col-start-1 lg:col-span-7" data-aos="fade-up">
              <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                Education
              </span>
              <h1 className="text-size-40 text-blackColor lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-10px dark:text-blackColor-dark">
                Cloud-based LMS <br className="hidden lg:block" />
                Trusted by 1000+
              </h1>
              <p className="text-size-15 lg:text-base 2xl:text-lg text-contentColor mb-5 2xl:mb-30px dark:text-contentColor-dark">
                Lorem Ipsum is simply dummy text of the printing
                <br className="hidden 2xl:block" />
                typesetting industry. Lorem Ipsum has been
              </p>
              <div>
                <form className="flex gap-x-15px items-center flex-wrap gap-y-5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="basis-[311px] h-14 leading-14 pl-3 border border-contentColor text-blackColor focus:outline-none rounded"
                  />
                  <button
                    type="submit"
                    className="text-size-15 text-whiteColor bg-primaryColor px-39px py-14px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
            {/* banner right */}
            <div className="lg:col-start-8 lg:col-span-5" data-aos="fade-up">
              <div className="tilt relative z-0">
                {/* bannar image */}
                <div className="flex flex-col items-center lg:items-end">
                  <img
                    className="text-center"
                    src="assets/images/education/education.png"
                    alt=""
                  />
                  <img
                    className="absolute left-0 bottom-[-93px] md:left-[30px] lg:left-0"
                    src="assets/images/education/education__1.png"
                    alt=""
                  />
                  <img
                    src="assets/images/education/education__2.png"
                    className="absolute left-5 top-10 md:left-[30px] lg:left-5 -z-10"
                    alt=""
                  />
                  <img
                    src="assets/images/education/education__3.png"
                    className="absolute -right-4 top-[-22px] md:right-[155px] lg:-right-4 z-[-1] animate-move-hor"
                    alt=""
                  />
                </div>
                <div className="w-300px md:w-342px absolute top-6 rihgt-0 md:top-[41px] md:right-[9px] lg:right-[-26px] 2xl:right-[-166px] bg-whiteColor p-10px flex gap-x-5 items-center animate-move-var shadow-hero-greeting dark:bg-whiteColor-dark">
                  <div>
                    <img
                      src="assets/images/about/about_16.png"
                      className="w-55px h-55px rounded block"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-size-15 font-semibold text-greencolor3">
                      Congratulations!!
                    </p>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark">
                      Your Admission Completed
                    </p>
                  </div>
                </div>
                <div className="absolute right-10 bottom-[-136px] md:right-[219px] md:bottom-[-105px] lg:right-[-50px] lg:bottom-[-125px] 2xl:right-10 2xl:bottom-[-105px]">
                  <a href="#" className="flex group">
                    <img
                      src="assets/images/education/education__4.png"
                      className="w-52px h-52px"
                      alt=""
                    />
                    <img
                      src="assets/images/education/education__5.png"
                      className="w-52px h-52px transition-all duration-300 -ml-35px group-hover:-ml-30px"
                      alt=""
                    />
                    <img
                      src="assets/images/education/education__6.png"
                      className="w-52px h-52px transition-all duration-300 -ml-35px group-hover:-ml-30px"
                      alt=""
                    />
                    <img
                      src="assets/images/education/education__7.png"
                      className="w-52px h-52px transition-all duration-300 -ml-35px group-hover:-ml-30px"
                      alt=""
                    />
                  </a>
                  <div>
                    <p className="text-sm text-lightGrey3 mb-15px">
                      Join over
                      <span className="text-blackColor dark:text-blackColor-dark">
                        4000+
                      </span>
                      students
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* bannaer section */}
    </section>
    {/* features */}
    <section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30px">
          {/* feature 1 */}
          <div
            className="p-5 md:p-26px md:pr-30px transition-all duration-300 border border-borderColor5 hover:border-primaryColor hover:shadow-feature flex rounded"
            data-aos="fade-up"
          >
            <div className="w-71.94px h-69.44px leading-69.44px bg-primaryColor bg-opacity-5 border border-primaryColor text-center mr-35px rounded-100 border-opacity-10">
              <i className="icofont-video-alt text-size-26 text-primaryColor" />
            </div>
            <div className="">
              <h3>
                <a
                  className="text-xl lg:text-lg 3xl:text-xl font-semibold text-contentColor mb-1 hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                  href="#"
                >
                  Video Training
                </a>
              </h3>
              <p className="text-sm text-lightGrey3">With unlimited courses</p>
            </div>
          </div>
          {/* feature 2 */}
          <div
            className="p-5 md:p-26px md:pr-30px transition-all duration-300 border border-borderColor5 hover:border-greencolor hover:shadow-feature flex rounded"
            data-aos="fade-up"
          >
            <div className="w-71.94px h-69.44px leading-69.44px bg-greencolor bg-opacity-5 border border-greencolor text-center mr-35px rounded-100 border-opacity-10">
              <i className="icofont-business-man-alt-1 text-size-26 text-greencolor" />
            </div>
            <div className="">
              <h3>
                <a
                  className="text-xl lg:text-lg 3xl:text-xl font-semibold text-contentColor mb-1 hover:text-greencolor dark:text-contentColor-dark dark:hover:text-greencolor"
                  href="#"
                >
                  Expert Teaceher
                </a>
              </h3>
              <p className="text-sm text-lightGrey3">With unlimited courses</p>
            </div>
          </div>
          {/* feature 3 */}
          <div
            className="p-5 md:p-26px md:pr-30px transition-all duration-300 border border-borderColor5 hover:border-secondaryColor hover:shadow-feature flex rounded"
            data-aos="fade-up"
          >
            <div className="w-71.94px h-69.44px leading-69.44px bg-secondaryColor bg-opacity-5 border border-secondaryColor text-center mr-35px rounded-100 border-opacity-10">
              <i className="icofont-book-alt text-size-26 text-secondaryColor" />
            </div>
            <div className="">
              <h3>
                <a
                  className="text-xl lg:text-lg 3xl:text-xl font-semibold text-contentColor mb-1 hover:text-secondaryColor dark:text-contentColor-dark dark:hover:text-secondaryColor"
                  href="#"
                >
                  Versatile Course
                </a>
              </h3>
              <p className="text-sm text-lightGrey3">With unlimited courses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* about  section */}
    <section>
      <div className="container">
        {/* about section  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30px pt-20">
          {/* about left */}
          <div data-aos="fade-up">
            <div className="tilt relative">
              <img
                className="w-full"
                src="assets/images/about/about_8.png"
                alt=""
              />
              <img
                className="absolute left-0 top-0 lg:top-4 right-0 mx-auto"
                src="assets/images/about/about_1.png"
                alt=""
              />
            </div>
          </div>
          {/* about right */}
          <div data-aos="fade-up">
            <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
              About Us
            </span>
            <h3 className="text-3xl md:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark pb-25px">
              Welcome to the
              <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-3 md:after:bottom-5">
                Online
              </span>
              Learning Center
            </h3>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-6">
              Forging relationships between multi to national Governments and
              global NGOs begins.
            </p>
            <ul className="space-y-5">
              <li className="flex items-center group">
                <i className="icofont-check text-primaryColor mr-15px border border-primaryColor rounded-full" />
                <p className="text-sm md:text-base text-blackColor dark:text-blackColor-dark">
                  Explore a variety of fresh educational teach
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check text-primaryColor mr-15px border border-primaryColor rounded-full" />
                <p className="text-sm md:text-base text-blackColor dark:text-blackColor-dark">
                  Explore a variety of fresh educational teach
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check text-primaryColor mr-15px border border-primaryColor rounded-full" />
                <p className="text-sm md:text-base text-blackColor dark:text-blackColor-dark">
                  Explore a variety of fresh educational teach
                </p>
              </li>
            </ul>
            <div className="mt-10">
              <a
                className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                href="#"
              >
                More About <i className="icofont-long-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  
   
    {/* courses section */}
   

    

  </main>


</>
 
    </div>
  )
}

export default PreviewComponent
