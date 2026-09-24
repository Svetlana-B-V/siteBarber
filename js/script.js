/* ============ МОДАЛЬНОЕ ОКНО ВХОДА ============ */
var link = document.querySelector(".login-link");
var popup = document.querySelector(".modal-login");
var close = popup.querySelector(".modal-close");
var form = popup.querySelector("form");
var login = popup.querySelector("[name=login]");
var password = popup.querySelector("[name=password]");

var isStorageSupport = true;
var storage = "";

try {
    storage = localStorage.getItem("login");
} catch (err) {
    isStorageSupport = false;
}

link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-show");

    if (storage) {
        login.value = storage;
        password.focus();
    } else {
        login.focus();
    }
});

close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-show");
    popup.classList.remove("modal-error");
});

form.addEventListener("submit", function (evt) {
    if (!login.value || !password.value) {
        evt.preventDefault();
        popup.classList.remove("modal-error");
        popup.offsetWidth = popup.offsetWidth;
        popup.classList.add("modal-error");
    } else {
        if (isStorageSupport) {
            localStorage.setItem("login", login.value);
        }
    }
});

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
        evt.preventDefault();
        if (popup.classList.contains("modal-show")) {
            popup.classList.remove("modal-show");
            popup.classList.remove("modal-error");
        }
    }
});

/* ============ КАРТА ============ */
var mapLink = document.querySelector(".contacts-button-map");
var mapPopup = document.querySelector(".modal-map");
var mapClose = mapPopup.querySelector(".modal-close");

mapLink.addEventListener("click", function (evt) {
    evt.preventDefault();
    mapPopup.classList.add("modal-show");
});

mapClose.addEventListener("click", function (evt) {
    evt.preventDefault();
    mapPopup.classList.remove("modal-show");
});

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
        evt.preventDefault();
        if (mapPopup.classList.contains("modal-show")) {
            mapPopup.classList.remove("modal-show");
        }
    }
});


/* ============================================================
   ✨ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ
   ============================================================
   Все элементы ниже первого экрана скрыты и плавно всплывают,
   как только попадают в область просмотра.
   ============================================================ */
(function () {
    "use strict";

    /* -----------------------------------------------
       1. НАСТРОЙКИ: какие элементы анимируем
       ----------------------------------------------- */
    var revealMap = [
        // Селектор                                Класс анимации
        { selector: '.features-list > .feature-item',       variant: 'reveal--up'    },
        { selector: '.index-columns > section',              variant: 'reveal--up'    },
        { selector: '.index-columns h2',                     variant: 'reveal--up'    },
        { selector: '.news-item',                            variant: 'reveal--left'  },
        { selector: '.gallery-container',                    variant: 'reveal--right' },
        { selector: '.contacts p',                           variant: 'reveal--left'  },
        { selector: '.appointment-info',                     variant: 'reveal--right' },
        { selector: '.appointment-item',                     variant: 'reveal--up'    },
        { selector: '.page-title',                           variant: 'reveal--up'    },
        { selector: '.breadcrumbs',                          variant: 'reveal--up'    },
        { selector: '.filters fieldset',                     variant: 'reveal--left'  },
        { selector: '.catalog-item',                         variant: 'reveal--zoom'  },
        { selector: '.pagination-item',                      variant: 'reveal--up'    },
        { selector: '.product-photo-preview > li',           variant: 'reveal--zoom'  },
        { selector: '.product-photo-full',                   variant: 'reveal--zoom'  },
        { selector: '.product-info',                         variant: 'reveal--right' },
        { selector: '.inner-content > *',                    variant: 'reveal--up'    },
        { selector: '.inner-columns > *',                    variant: 'reveal--up'    },
        { selector: '.custom-list-1 li',                     variant: 'reveal--left'  },
        { selector: '.big-heading',                          variant: 'reveal--zoom'  },
        { selector: '.footer-contacts',                      variant: 'reveal--left'  },
        { selector: '.footer-social',                        variant: 'reveal--up'    },
        { selector: '.footer-copyright',                     variant: 'reveal--right' }
    ];

    /* -----------------------------------------------
       2. Проверяем поддержку IntersectionObserver
       ----------------------------------------------- */
    if (!('IntersectionObserver' in window)) {
        // Фоллбэк: всё сразу показываем
        revealMap.forEach(function (item) {
            var nodes = document.querySelectorAll(item.selector);
            Array.prototype.forEach.call(nodes, function (el) {
                el.classList.add('reveal', 'is-visible');
            });
        });
        return;
    }

    /* -----------------------------------------------
       3. Создаём наблюдатель
       ----------------------------------------------- */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;

                // Небольшая задержка для плавности, если элемент снова в поле зрения
                // (при повторной прокрутке ничего не сломается — просто остаётся видимым)
                el.classList.add('is-visible');

                // Прекращаем наблюдение — элемент уже проявился
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.12,                     // элемент появился на 12%
        rootMargin: '0px 0px -60px 0px'      // реагируем чуть раньше низа экрана
    });

    /* -----------------------------------------------
       4. Регистрируем все элементы
       ----------------------------------------------- */
    revealMap.forEach(function (item) {
        var nodes = document.querySelectorAll(item.selector);

        Array.prototype.forEach.call(nodes, function (el) {
            // Пропускаем, если элемент уже в поле зрения при загрузке
            // — его мы тоже красиво анимируем, но с задержкой 0
            el.classList.add('reveal', item.variant);

            // Каскадная задержка внутри одной группы
            var parent = el.parentElement;
            if (parent) {
                var siblings = Array.prototype.filter.call(
                    parent.children,
                    function (child) {
                        return child.matches && child.matches(item.selector);
                    }
                );
                var index = siblings.indexOf(el);
                if (index > -1) {
                    el.style.transitionDelay = Math.min(index, 8) * 80 + 'ms';
                }
            }

            observer.observe(el);
        });
    });

    /* -----------------------------------------------
       5. Резервный обработчик (для очень старых браузеров
          и случаев, когда IntersectionObserver «молчит»)
       ----------------------------------------------- */
    var scrollTick = false;
    function checkVisible() {
        var windowHeight = window.innerHeight;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        var all = document.querySelectorAll('.reveal:not(.is-visible)');
        Array.prototype.forEach.call(all, function (el) {
            var rect = el.getBoundingClientRect();
            var top = rect.top + scrollY;
            var bottom = rect.bottom + scrollY;

            // Если элемент в зоне видимости
            if (bottom > scrollY && top < scrollY + windowHeight - 60) {
                el.classList.add('is-visible');
            }
        });
        scrollTick = false;
    }

    window.addEventListener('scroll', function () {
        if (!scrollTick) {
            window.requestAnimationFrame(checkVisible);
            scrollTick = true;
        }
    }, { passive: true });

    // Первичная проверка после загрузки
    window.addEventListener('load', checkVisible);
    checkVisible();
})();