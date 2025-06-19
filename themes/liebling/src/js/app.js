import cssVars from 'css-vars-ponyfill'
import $ from 'jquery'
import lozad from 'lozad'
import Headroom from "headroom.js"
import slick from 'slick-carousel'
import tippy from 'tippy.js'
import shave from 'shave'
import AOS from 'aos'
import Fuse from 'fuse.js'
import {sites, config} from './configSites'
import {
  isRTL,
  formatDate,
  isDarkMode,
  isMobile,
  getParameterByName
} from './helpers'

cssVars({})

$(document).ready(() => {
  if (isRTL()) {
    $('html').attr('dir', 'rtl').addClass('rtl')
  }

  const $body = $('body')
  const $header = $('.js-header')
  const $openMenu = $('.js-open-menu')
  const $closeMenu = $('.js-close-menu')
  const $menu = $('.js-menu')
  const $toggleSubmenu = $('.js-toggle-submenu')
  const $submenuOption = $('.js-submenu-option')[0]
  const $submenu = $('.js-submenu')
  const $recentArticles = $('.js-recent-articles')
  const $openSecondaryMenu = $('.js-open-secondary-menu')
  const $openSearch = $('.js-open-search')
  const $closeSearch = $('.js-close-search')
  const $search = $('.js-search')
  const $inputSearch = $('.js-input-search')
  const $socialList = $('#js-social-list')
  const $searchResults = $('.js-search-results')
  const $searchNoResults = $('.js-no-results')
  const $toggleDarkMode = $('.js-toggle-darkmode')
  const $closeNotification = $('.js-notification-close')
  const currentSavedTheme = localStorage.getItem('theme')

  const ghostSearchApiKey = getSiteConfig().keyIntegration

  function renderSocialList () {
    let htmlString = ''
    const social = getSiteConfig().social;
    Object.keys(social).map((item, index) => {
      if(social[item]) {
        htmlString += `
            <a href="${social[item]}" target="_blank" rel="noopener" aria-label="${item}">\
              <span class="icon-${item}"></span>\
            </a>`
      }
    })
    $socialList.html(htmlString)
  }

  let fuse = null
  let submenuIsOpen = false
  let secondaryMenuTippy = null

  function showSubmenu() {
    $header.addClass('submenu-is-active')
    $toggleSubmenu.addClass('active')
    $submenu.removeClass('closed').addClass('opened')
  }

  function hideSubmenu() {
    $header.removeClass('submenu-is-active')
    $toggleSubmenu.removeClass('active')
    $submenu.removeClass('opened').addClass('closed')
  }

  function toggleScrollVertical() {
    $body.toggleClass('no-scroll-y')
  }

  function trySearchFeature() {
    if (typeof ghostSearchApiKey !== 'undefined' && ghostSearchApiKey !== '') {
      getAllPosts(ghostHost, ghostSearchApiKey)
    } else {
      $openSearch.css('visibility', 'hidden')
      $closeSearch.remove()
      $search.remove()
    }
  }

  function getSiteConfig () {
    let generalConfig;
    const host = location.hostname;
    if (host.indexOf(sites.SEMINUEVOS) >= 0) {
      generalConfig = config[sites.SEMINUEVOS]
    } else if (host.indexOf(sites.PATIOTUERCA_ECUADOR) >= 0) {
      generalConfig = config[sites.PATIOTUERCA_ECUADOR]
    } else if (host.indexOf(sites.PATIOTUERCA_BOLIVIA) >= 0) {
      generalConfig = config[sites.PATIOTUERCA_BOLIVIA]
    } else if (host.indexOf(sites.PATIOTUERCA_PANAMA) >= 0) {
      generalConfig = config[sites.PATIOTUERCA_PANAMA]
    } else if (host.indexOf(sites.AUTOFOCO) >= 0) {
      generalConfig = config[sites.AUTOFOCO]
    } else if (host.indexOf(sites.TODOAUTOS) >= 0) {
      generalConfig = config[sites.TODOAUTOS]
    }
    return generalConfig;
  }

  function changeDomainLink(object, remove = '') {
    const domain = getSiteConfig().domain;
    const ghost = getSiteConfig().ghost;
    const linkBody = $('body').find(object);
    linkBody.each(function () {
      const href = $(this).attr("href").replace(ghost, domain).replace(remove, '')
      $(this).attr("href", href)
    })
  }

  function changeLinkTagHeader(prop) {
    const domain = getSiteConfig().domain;
    const ghost = getSiteConfig().ghost;
    const link = $('link[rel="'+prop+'"]').attr('href');
    if(link) {
      const linkChange = link.replace(ghost, domain)
      $('link[rel="'+prop+'"]').attr('href', linkChange);
    }
  }

  function changeMetaTagHeader(prop) {
    const domain = getSiteConfig().domain;
    const ghost = getSiteConfig().ghost;
    const meta = $('meta[property="'+prop+'"]').attr('content');
    if(meta) {
      const metaChange = meta.replace(ghost, domain)
      $('meta[property="'+prop+'"]').attr('content', metaChange);
    }
  }

  function changeMetaTagHeaderOpenGraph(prop) {
    const domain = getSiteConfig().domain;
    const ghost = getSiteConfig().ghost;
    const meta = $('meta[name="'+prop+'"]').attr('content');
    if(meta) {
      const metaChange = meta.replace(ghost, domain)
      $('meta[name="'+prop+'"]').attr('content', metaChange);
    }
  }

  function addGTM () {
    const gtm = getSiteConfig().gtm;

    $('head').prepend(gtm ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtm}');</script>` : '')
  }

  function getAllPosts(host, key) {
    const api = new GhostContentAPI({
      url: host,
      key,
      version: 'v2'
    })
    const allPosts = []
    const fuseOptions = {
      shouldSort: true,
      threshold: 0,
      location: 0,
      distance: 100,
      tokenize: true,
      matchAllTokens: false,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['title', 'custom_excerpt', 'html']
    }

    api.posts.browse({
      limit: config.getAllPostInSearch,
      fields: 'id, title, url, published_at, custom_excerpt, html'
    })
      .then((posts) => {
        for (var i = 0, len = posts.length; i < len; i++) {
          allPosts.push(posts[i])
        }

        fuse = new Fuse(allPosts, fuseOptions)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const showNotification = (typeNotification) => {
    const $notification = $(`.js-alert[data-notification="${typeNotification}"]`)
    $notification.addClass('opened')
    setTimeout(() => {
      closeNotification($notification)
    }, 5000)
  }

  const closeNotification = ($notification) => {
    $notification.removeClass('opened')
    const url = window.location.toString()

    if (url.indexOf('?') > 0) {
      const cleanUrl = url.substring(0, url.indexOf('?'))
      window.history.replaceState({}, document.title, cleanUrl)
    }
  }

  const checkForActionParameter = () => {
    const action = getParameterByName('action')
    const stripe = getParameterByName('stripe')

    if (action === 'subscribe') {
      showNotification('subscribe')
    }

    if (action === 'signup') {
      window.location = `${ghostHost}/signup/?action=checkout`
    }

    if (action === 'checkout') {
      showNotification('signup')
    }

    if (action === 'signin') {
      showNotification('signin')
    }

    if (stripe === 'success') {
      showNotification('checkout')
    }
  }

  $openMenu.click(() => {
    $header.addClass('mobile-menu-opened')
    $menu.addClass('opened')
    toggleScrollVertical()
  })

  $closeMenu.click(() => {
    $header.removeClass('mobile-menu-opened')
    $menu.removeClass('opened')
    toggleScrollVertical()
  })

  $toggleSubmenu.click(() => {
    submenuIsOpen = !submenuIsOpen

    if (submenuIsOpen) {
      showSubmenu()
    } else {
      hideSubmenu()
    }
  })

  $openSearch.click(() => {
    $search.addClass('opened')
    setTimeout(() => {
      $inputSearch.focus()
    }, 400);
    toggleScrollVertical()
  })

  $closeSearch.click(() => {
    $inputSearch.blur()
    $search.removeClass('opened')
    toggleScrollVertical()
  })

  $inputSearch.keyup((e) => {
    if (e.keyCode !== 13) {
      if ($inputSearch.val().length > 0 && fuse) {
        const results = fuse.search($inputSearch.val())
        let htmlString = ''

        if (results.length > 0) {
          for (var i = 0, len = results.length; i < len; i++) {
            htmlString += `
            <article class="m-result">\
              <a href="${results[i].url}" class="m-result__link">\
                <h3 class="m-result__title">${results[i].title}</h3>\
                <span class="m-result__date">${formatDate(results[i].published_at)}</span>\
              </a>\
            </article>`
          }

          $searchNoResults.hide()
          $searchResults.html(htmlString)
          $searchResults.show()
        } else {
          $searchResults.html('')
          $searchResults.hide()
          $searchNoResults.show()
        }
      } else {
        $searchResults.html('')
        $searchResults.hide()
        $searchNoResults.hide()
      }
    }
  })

  $toggleDarkMode.change(() => {
    if ($toggleDarkMode.is(':checked')) {
      $('html').attr('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      $('html').attr('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  })

  $closeNotification.click(function () {
    closeNotification($(this).parent())
  })

  $(window).click((e) => {
    if (submenuIsOpen) {
      if ($submenuOption && !$submenuOption.contains(e.target)) {
        submenuIsOpen = false
        hideSubmenu()
      }
    }
  })

  if (currentSavedTheme) {
    $('html').attr('data-theme', currentSavedTheme)

    if (currentSavedTheme === 'dark') {
      $toggleDarkMode.attr('checked', true)
    }
  } else {
    if (isDarkMode()) {
      $toggleDarkMode.attr('checked', true)
    }
  }

  if ($header.length > 0) {
    const headroom = new Headroom($header[0], {
      tolerance: {
        down: 10,
        up: 20
      },
      offset: 15,
      onUnpin: () => {
        if (!isMobile() && secondaryMenuTippy) {
          const desktopSecondaryMenuTippy = secondaryMenuTippy[0]

          if (
            desktopSecondaryMenuTippy && desktopSecondaryMenuTippy.state.isVisible
          ) {
            desktopSecondaryMenuTippy.hide()
          }
        }
      }
    })
    headroom.init()
  }

  if ($recentArticles.length > 0) {
    $recentArticles.on('init', function () {
      shave('.js-recent-article-title', 50)
    })

    $recentArticles.slick({
      adaptiveHeight: true,
      arrows: false,
      infinite: false,
      mobileFirst: true,
      variableWidth: true,
      rtl: isRTL()
    })
  }

  if (typeof disableFadeAnimation === 'undefined' || !disableFadeAnimation) {
    AOS.init({
      once: true,
      startEvent: 'DOMContentLoaded',
    })
  } else {
    $('[data-aos]').addClass('no-aos-animation')
  }

  const observer = lozad('.lozad', {
    loaded: (el) => {
      el.classList.add('loaded')
    }
  })
  observer.observe()

  if ($openSecondaryMenu.length > 0) {
    const template = document.getElementById('secondary-navigation-template')

    secondaryMenuTippy = tippy('.js-open-secondary-menu', {
      content: template.innerHTML,
      arrow: true,
      trigger: 'click',
      interactive: true
    })
  }

  tippy('.js-tooltip')

  shave('.js-article-card-title', 100)
  shave('.js-article-card-title-no-image', 250)

  renderSocialList()
  addGTM()
  changeMetaTagHeader("og:url")
  changeMetaTagHeaderOpenGraph("twitter:url")
  changeLinkTagHeader("canonical")
  changeLinkTagHeader("amphtml")
  changeDomainLink("a.in-share")
  changeDomainLink("a.m-logo", "/blog")
  changeDomainLink("a.m-heading__meta__tag")
  changeDomainLink("a.latam-primary-text")
  changeDomainLink("a.m-recent-article")
  changeDomainLink("a.m-article-card__tag")
  checkForActionParameter()
  trySearchFeature()
})
