/* ============================================================
   МЕДИЯПОРТ 4 — СПИСЪК С ВИДЕА (динамичен)
   ============================================================
   Добавяш нов обект в масива foreign или ours — и той
   автоматично се появява в сайта. Няма нужда да пипаш HTML.

   Формат:
   {
     n: 'ИМЕ НА ВИДЕОТО',      // задължително
     m: '2024 - 3:45',          // по избор (мета)
     url: 'https://...'         // задължително (mp4, youtube, vimeo, m3u8)
   }

   Можеш да добавяш колкото искаш видеа — списъкът се
   генерира автоматично.
   ============================================================ */

var MEDIA_PORT_VIDEOS = {

  /* ---------- ЧУЖДИ ВИДЕА ---------- */
  foreign: [
    {
      n: 'ЧУЖДО 1',
      m: '2024 - 3:45',
      url: 'https://example.com/videos/foreign1.mp4'
    },
    {
      n: 'ЧУЖДО 2',
      m: '2024 - 8:12',
      url: 'https://example.com/videos/foreign2.mp4'
    },
    {
      n: 'ЧУЖДО 3',
      m: '2025 - 12:30',
      url: 'https://example.com/videos/foreign3.mp4'
    },
    {
      n: 'ЧУЖДО 4',
      m: '2025 - 5:20',
      url: 'https://example.com/videos/foreign4.mp4'
    },
    {
      n: 'ЧУЖДО 5',
      m: '2026 - 7:15',
      url: 'https://example.com/videos/foreign5.mp4'
    }

    /* Добавяй нови тук, разделени със запетая:
    ,
    {
      n: 'ЧУЖДО 6',
      m: '2026 - 2:10',
      url: 'https://example.com/videos/foreign6.mp4'
    }
    */
  ],

  /* ---------- НАШИ ВИДЕА ---------- */
  ours: [
    {
      n: 'НАШЕ 1',
      m: '2024 - 2:15',
      url: 'https://example.com/videos/ours1.mp4'
    },
    {
      n: 'НАШЕ 2',
      m: '2025 - 4:42',
      url: 'https://example.com/videos/ours2.mp4'
    },
    {
      n: 'НАШЕ 3',
      m: '2025 - 1:58',
      url: 'https://example.com/videos/ours3.mp4'
    },
    {
      n: 'НАШЕ 4',
      m: '2026 - 6:30',
      url: 'https://example.com/videos/ours4.mp4'
    }

    /* Добавяй нови тук, разделени със запетая:
    ,
    {
      n: 'НАШЕ 5',
      m: '2026 - 9:00',
      url: 'https://example.com/videos/ours5.mp4'
    }
    */
  ]
};

/* ============================================================
   АВТОМАТИЧНО ГЕНЕРИРАНЕ НА СПИСЪКА В САЙТА
   ============================================================ */
(function autoRenderVideoList() {
  'use strict';

  function getVideosByFolder(folder) {
    return (MEDIA_PORT_VIDEOS && MEDIA_PORT_VIDEOS[folder]) || [];
  }

  function makeItem(v) {
    var item = document.createElement('div');
    item.className = 'vhs-video-item';
    var name = v.n || 'БЕЗ ИМЕ';
    var meta = v.m || '';
    item.innerHTML =
      '<div class="vhs-video-thumb">' +
        '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
      '</div>' +
      '<div class="vhs-video-info">' +
        '<div class="vhs-video-name"></div>' +
        (meta ? '<div class="vhs-video-meta"></div>' : '') +
      '</div>';
    item.querySelector('.vhs-video-name').textContent = name;
    if (meta) item.querySelector('.vhs-video-meta').textContent = meta;
    item.dataset.url = v.url || '';
    item.dataset.name = name;
    return item;
  }

  function renderFolder(folder) {
    var vhsVideoItems = document.getElementById('vhsVideoItems');
    var vhsListTitle = document.getElementById('vhsListTitle');
    var vhsFolders = document.getElementById('vhsFolders');
    var vhsVideoList = document.getElementById('vhsVideoList');
    if (!vhsVideoItems) return;

    var list = getVideosByFolder(folder);
    vhsVideoItems.innerHTML = '';
    if (vhsListTitle) {
      vhsListTitle.textContent = folder === 'foreign' ? 'Чужди видеа' : 'Наши видеа';
    }
    if (list.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'vhs-video-meta';
      empty.style.textAlign = 'center';
      empty.style.padding = '20px';
      empty.textContent = 'Няма видеа в тази папка';
      vhsVideoItems.appendChild(empty);
    } else {
      list.forEach(function(v) {
        var item = makeItem(v);
        item.addEventListener('click', function() {
          var infoName = document.getElementById('infoName');
          var infoTime = document.getElementById('infoTime');
          if (infoName) {
            infoName.style.animation = 'none';
            void infoName.offsetWidth;
            infoName.textContent = v.n || 'БЕЗ ИМЕ';
            infoName.style.animation = '';
          }
          if (infoTime) infoTime.textContent = '0:00';

          if (typeof window.playVideoFromUrl === 'function' && v.url) {
            window.playVideoFromUrl(v.url);
          }

          if (vhsVideoList) vhsVideoList.classList.remove('visible');
          setTimeout(function() {
            if (vhsVideoList) vhsVideoList.classList.remove('active');
            if (vhsFolders) vhsFolders.classList.remove('hidden');
          }, 350);
        });
        vhsVideoItems.appendChild(item);
      });
    }

    if (vhsFolders) vhsFolders.classList.add('hidden');
    if (vhsVideoList) vhsVideoList.classList.add('active');
    setTimeout(function() {
      if (vhsVideoList) vhsVideoList.classList.add('visible');
    }, 20);
  }

  function initFolders() {
    document.querySelectorAll('.vhs-folder').forEach(function(f) {
      if (f.dataset.bound) return;
      f.dataset.bound = '1';
      f.addEventListener('click', function() {
        var key = f.getAttribute('data-folder');
        renderFolder(key);
      });
    });

    var vhsBackBtn = document.getElementById('vhsBackBtn');
    if (vhsBackBtn && !vhsBackBtn.dataset.bound) {
      vhsBackBtn.dataset.bound = '1';
      vhsBackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var vhsVideoList = document.getElementById('vhsVideoList');
        var vhsFolders = document.getElementById('vhsFolders');
        if (vhsVideoList) vhsVideoList.classList.remove('visible');
        setTimeout(function() {
          if (vhsVideoList) vhsVideoList.classList.remove('active');
          if (vhsFolders) vhsFolders.classList.remove('hidden');
        }, 350);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFolders);
  } else {
    initFolders();
  }

  window.MediaPortVideos = {
    renderFolder: renderFolder,
    getVideosByFolder: getVideosByFolder,
    all: MEDIA_PORT_VIDEOS
  };
})();