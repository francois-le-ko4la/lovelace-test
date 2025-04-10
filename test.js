/**
 * @fileoverview
 *
 * This file defines a custom element `EntityProgressCard` for displaying
 * progress or status information about an entity in Home Assistant.
 * The card displays visual elements like icons, progress bars, and other dynamic content
 * based on the state of the entity and user configurations.
 *
 * Key Features:
 * - Dynamic content update (e.g., progress bar, icons) based on entity state.
 * - Support for theme and layout customization.
 * - Error handling for missing or invalid entities.
 * - Configuration options for various card elements.
 *
 * More informations here: https://github.com/francois-le-ko4la/lovelace-entity-progress-card/
 *
 * @author ko4la
 * @version 1.2.2
 *
 */

/** --------------------------------------------------------------------------
 * PARAMETERS
 */

const VERSION = '1.2.2';
const CARD = {
  meta: {
    typeName: 'entity-progress-card',
    name: 'Entity Progress Card',
    description: 'A cool custom card to show current entity status with a progress bar.',
    editor: 'entity-progress-card-editor',
  },
  config: {
    language: 'en',
    value: { min: 0, max: 100 },
    unit: { default: '%', fahrenheit: '°F', timer: 'timer', flexTimer: 'flextimer', disable: '' },
    showMoreInfo: true,
    reverse: false,
    decimal: { percentage: 0, timer: 0, other: 2 },
    entity: {
      state: { unavailable: 'unavailable', unknown: 'unknown', notFound: 'notFound', idle: 'idle', active: 'active', paused: 'paused' },
      type: { timer: 'timer', light: 'light', cover: 'cover', fan: 'fan', climate: 'climate', counter: 'counter' },
      class: { shutter: 'shutter', battery: 'battery' },
    },
    msFactor: 1000,
    shadowMode: 'open',
    refresh: { ratio: 500, min: 250, max: 1000 },
    languageMap: {
      af: 'af-ZA',
      ar: 'ar',
      bg: 'bg-BG',
      bn: 'bn',
      ca: 'ca-ES',
      cs: 'cs-CZ',
      da: 'da-DK',
      de: 'de-DE',
      'de-CH': 'de-CH',
      el: 'el-GR',
      en: 'en-US',
      es: 'es-ES',
      et: 'et-EE',
      eu: 'eu-ES',
      fa: 'fa-IR',
      fi: 'fi-FI',
      fr: 'fr-FR',
      gl: 'gl-ES',
      gu: 'gu-IN',
      he: 'he-IL',
      hi: 'hi-IN',
      hr: 'hr-HR',
      hu: 'hu-HU',
      id: 'id-ID',
      is: 'is-IS',
      it: 'it-IT',
      ja: 'ja-JP',
      ka: 'ka-GE',
      kn: 'kn-IN',
      ko: 'ko-KR',
      kw: 'kw-GB',
      lb: 'lb-LU',
      lt: 'lt-LT',
      lv: 'lv-LV',
      ml: 'ml-IN',
      mn: 'mn-MN',
      mr: 'mr-IN',
      ms: 'ms-MY',
      nb: 'nb-NO',
      ne: 'ne-NP',
      nl: 'nl-NL',
      pl: 'pl-PL',
      pt: 'pt-PT',
      'pt-br': 'pt-BR',
      ro: 'ro-RO',
      ru: 'ru-RU',
      sk: 'sk-SK',
      sl: 'sl-SI',
      sr: 'sr-RS',
      'sr-Latn': 'sr-Latn-RS',
      sv: 'sv-SE',
      sw: 'sw-KE',
      te: 'te-IN',
      th: 'th-TH',
      tr: 'tr-TR',
      uk: 'uk-UA',
      ur: 'ur-PK',
      vi: 'vi-VN',
      'zh-cn': 'zh-CN',
      'zh-hk': 'zh-HK',
      'zh-tw': 'zh-TW',
      'zh-Hant': 'zh-TW',
    },
    debug: false,
  },
  htmlStructure: {
    card: { element: 'ha-card' },
    sections: {
      container: { element: 'div', class: 'container' },
      left: { element: 'div', class: 'left' },
      right: { element: 'div', class: 'right' },
    },
    elements: {
      icon: { element: 'ha-icon', class: 'icon' },
      shape: { element: 'ha-shape', class: 'shape' },
      name: { element: 'div', class: 'name' },
      percentage: { element: 'div', class: 'percentage' },
      secondaryInfo: { element: 'div', class: 'secondary-info' },
      progressBar: {
        container: { element: 'div', class: 'progress-bar-container' },
        bar: { element: 'div', class: 'progress-bar' },
        inner: { element: 'div', class: 'progress-bar-inner' },
      },
      badge: {
        container: { element: 'div', class: 'badge' },
        icon: { element: 'ha-icon', class: 'badge-icon' },
      },
    },
    alert: {
      container: { element: 'progress-alert' },
      icon: { element: 'ha-icon', class: 'progress-alert-icon' },
      message: { element: 'div', class: 'progress-alert-message' },
    },
  },
  style: {
    element: 'style',
    color: {
      default: 'var(--state-icon-color)',
      disabled: 'var(--dark-grey-color)',
      unavailable: 'var(--state-unavailable-color)',
      notFound: 'var(--state-inactive-color)',
      active: 'var(--state-active-color)',
      coverActive: 'var(--state-cover-active-color)',
      lightActive: '#FF890E',
      fanActive: 'var(--state-fan-active-color)',
      battery: {
        low: 'var(--state-sensor-battery-low-color)',
        medium: 'var(--state-sensor-battery-medium-color)',
        high: 'var(--state-sensor-battery-high-color)',
      },
      climate: {
        dry: 'var(--state-climate-dry-color)',
        cool: 'var(--state-climate-cool-color)',
        heat: 'var(--state-climate-heat-color)',
        fanOnly: 'var(--state-climate-fan_only-color)',
      },
      inactive: 'var(--state-inactive-color)',
    },
    icon: {
      default: { icon: 'mdi:alert' },
      alert: { icon: 'mdi:alert-circle-outline', color: '#0080ff', attribute: 'icon' },
      notFound: { icon: 'mdi:help' },
      badge: {
        unavailable: { icon: 'mdi:exclamation-thick', color: 'white', backgroundColor: 'var(--orange-color)', attribute: 'icon' },
        notFound: { icon: 'mdi:exclamation-thick', color: 'white', backgroundColor: 'var(--red-color)', attribute: 'icon' },
        timer: {
          active: { icon: 'mdi:play', color: 'white', backgroundColor: 'var(--success-color)', attribute: 'icon' },
          paused: { icon: 'mdi:pause', color: 'white', backgroundColor: 'var(--state-icon-color)', attribute: 'icon' },
        },
      },
      byDeviceDomain: {
        binary_sensor: 'mdi:circle-outline',
        climate: 'mdi:thermostat',
        counter: 'mdi:counter',
        cover: 'mdi:garage',
        fan: 'mdi:fan',
        input_boolean: 'mdi:toggle-switch',
        input_number: 'mdi:numeric',
        input_select: 'mdi:form-dropdown',
        media_player: 'mdi:speaker',
        light: 'mdi:lightbulb',
        lock: 'mdi:lock',
        person: 'mdi:account',
        sensor: 'mdi:eye',
        scene: 'mdi:palette',
        switch: 'mdi:toggle-switch',
        timer: 'mdi:timer-outline',
        weather: 'mdi:weather-cloudy',
        sun: 'mdi:white-balance-sunny',
      },
      byDeviceClass: {
        battery: 'mdi:battery',
        carbon_dioxide: 'mdi:molecule-co2',
        cold: 'mdi:snowflake',
        connectivity: 'mdi:wifi',
        current: 'mdi:current-ac',
        door: 'mdi:door-open',
        duration: 'mdi:timer-outline',
        energy: 'mdi:flash',
        gas: 'mdi:fire',
        heat: 'mdi:fire',
        humidity: 'mdi:water-percent',
        illuminance: 'mdi:brightness-5',
        lock: 'mdi:lock',
        moisture: 'mdi:water',
        motion: 'mdi:motion-sensor',
        occupancy: 'mdi:account',
        opening: 'mdi:window-open',
        plug: 'mdi:power-plug',
        pm25: 'mdi:molecule',
        power: 'mdi:flash',
        power_factor: 'mdi:flash',
        pressure: 'mdi:gauge',
        problem: 'mdi:alert',
        safety: 'mdi:shield-check',
        shutter: 'mdi:window-shutter',
        smoke: 'mdi:smoke-detector',
        sound: 'mdi:volume-high',
        switch: 'mdi:power-socket',
        temperature: 'mdi:thermometer',
        timestamp: 'mdi:calendar-clock',
        tv: 'mdi:television',
        vibration: 'mdi:vibrate',
        volatile_organic_compounds_parts: 'mdi:molecule',
        voltage: 'mdi:flash',
        window: 'mdi:window-open',
      },
      suffix: { open: '-open' },
    },
    bar: {
      radius: '4px',
      sizeOptions: {
        small: { label: 'small', mdi: 'mdi:size-s', size: '8px' },
        medium: { label: 'medium', mdi: 'mdi:size-m', size: '12px' },
        large: { label: 'large', mdi: 'mdi:size-l', size: '16px' },
      },
    },
    dynamic: {
      badge: {
        color: { var: '--epb-badge-color', default: 'var(--orange-color)' },
        backgroundColor: { var: '--epb-badge-bgcolor', default: 'white' },
      },
      iconAndShape: {
        color: { var: '--epb-icon-and-shape-color', default: 'var(--state-icon-color)' },
      },
      progressBar: {
        color: { var: '--epb-progress-bar-color', default: 'var(--state-icon-color)' },
        size: { var: '--epb-progress-bar-size', default: '0%' },
        orientation: { rtl: 'rtl_orientation' },
      },
      secondaryInfoError: { class: 'secondary-info-error' },
      show: 'show',
      hide: 'hide',
      clickable: { card: 'clickableCard', icon: 'clickableIcon'},
      hiddenComponent: {
        icon: { label: 'icon', class: 'hide_icon' },
        shape: { label: 'shape', class: 'hide_shape' },
        name: { label: 'name', class: 'hide_name' },
        secondary_info: { label: 'secondary_info', class: 'hide_secondary_info' },
        progress_bar: { label: 'progress_bar', class: 'hide_progress_bar' },
      },
    },
  },
  layout: {
    orientations: {
      horizontal: {
        label: 'horizontal',
        grid: { grid_rows: 1, grid_min_rows: 1, grid_columns: 2, grid_min_columns: 2 },
        mdi: 'mdi:focus-field-horizontal',
        minHeight: '56px',
      },
      vertical: {
        label: 'vertical',
        grid: { grid_rows: 2, grid_min_rows: 2, grid_columns: 1, grid_min_columns: 1 },
        mdi: 'mdi:focus-field-vertical',
        minHeight: '120px',
      },
    },
  },
  interactions: {
    event: {
      HASelect: ['selected'],
      toggle: ['change'],
      other: ['value-changed', 'input'],
      closed: 'closed',
      click: 'click',
      configChanged: 'config-changed',
      originalTarget: { icon: ['ha-shape', 'ha-svg-icon'] },
      from: { icon: 'icon', card: 'card' },
    },
    action: {
      default: 'default',
      navigate: { action: 'navigate' },
      moreInfo: { action: 'more-info' },
      url: { action: 'url' },
      assist: { action: 'assist' },
      toggle: { action: 'toggle' },
      performAction: { action: 'perform-action' },
      none: { action: 'none' },
    },
  },
  editor: {
    fields: {
      container: { element: 'div', class: 'editor' },
      entity: { type: 'entity', element: 'ha-form' },
      attribute: { type: 'attribute', element: 'ha-select' },
      max_value_attribute: { type: 'max_value_attribute', element: 'ha-select' },
      icon: { type: 'icon', element: 'ha-form' },
      layout: { type: 'layout', element: 'ha-select' },
      bar_size: { type: 'bar_size', element: 'ha-select' },
      tap_action: { type: 'tap_action', element: 'ha-form' },
      hold_action: { type: 'hold_action', element: 'ha-form' },
      icon_tap_action: { type: 'icon_tap_action', element: 'ha-form' },
      theme: { type: 'theme', element: 'ha-select' },
      color: { type: 'color', element: 'ha-form' },
      number: { type: 'number', element: 'ha-textfield' },
      default: { type: 'text', element: 'ha-textfield' },
      listItem: { type: 'list item', element: 'mwc-list-item' },
      iconItem: { element: 'ha-icon', attribute: 'icon', class: 'editor-icon-list' },
      select: { element: 'ha-select' },
      toggle: { type: 'toggle', element: 'ha-switch' },
      text: { element: 'span' },
      accordion: {
        item: { element: 'div', class: 'accordion' },
        icon: { element: 'ha-icon', class: 'accordion-icon' },
        title: { element: 'button', class: 'accordion-title' },
        arrow: { element: 'ha-icon', class: 'accordion-arrow', icon: 'mdi:chevron-down' },
        content: { element: 'div', class: 'accordion-content' },
      },
    },
    keyMappings: {
      attribute: 'attribute',
      max_value_attribute: 'max_value_attribute',
      url_path: 'url_path',
      navigation_path: 'navigation_path',
      theme: 'theme',
      tapAction: 'tap_action',
    },
  },
  theme: {
    default: '**CUSTOM**',
    battery: { label: 'battery', icon: 'battery' },
    customTheme: { expectedKeys: ['min', 'max', 'color'] },
  },
  documentation: {
    link: {
      element: 'a',
      class: 'documentation-link',
      linkTarget: '_blank',
      documentationUrl: 'https://github.com/francois-le-ko4la/lovelace-entity-progress-card/',
    },
    shape: { element: 'div', class: 'documentation-link-shape' },
    questionMark: {
      element: 'ha-icon',
      class: 'documentation-icon',
      icon: 'mdi:help-circle',
      style: { width: '24px', class: '24px' },
    },
  },
};

CARD.console = {
  message: `%c✨${CARD.meta.typeName.toUpperCase()} ${VERSION} IS INSTALLED.`,
  css: 'color:orange; background-color:black; font-weight: bold;',
  link: '      For more details, check the README: https://github.com/francois-le-ko4la/lovelace-entity-progress-card',
};

const DEF_COLORS = [
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'light-grey',
  'grey',
  'dark-grey',
  'blue-grey',
  'black',
  'white',
  'disabled',
];

const THEME = {
  optimal_when_low: {
    linear: false,
    percent: true,
    style: [
      { min: 0, max: 20, icon: null, color: 'var(--success-color)' },
      { min: 20, max: 50, icon: null, color: 'var(--yellow-color)' },
      { min: 50, max: 80, icon: null, color: 'var(--accent-color)' },
      { min: 80, max: 100, icon: null, color: 'var(--red-color)' },
    ],
  },
  optimal_when_high: {
    linear: false,
    percent: true,
    style: [
      { min: 0, max: 20, icon: null, color: 'var(--red-color)' },
      { min: 20, max: 50, icon: null, color: 'var(--accent-color)' },
      { min: 50, max: 80, icon: null, color: 'var(--yellow-color)' },
      { min: 80, max: 100, icon: null, color: 'var(--success-color)' },
    ],
  },
  light: {
    linear: true,
    percent: true,
    style: [
      { icon: 'mdi:lightbulb-outline', color: '#4B4B4B' },
      { icon: 'mdi:lightbulb-outline', color: '#877F67' },
      { icon: 'mdi:lightbulb', color: '#C3B382' },
      { icon: 'mdi:lightbulb', color: '#FFE79E' },
      { icon: 'mdi:lightbulb', color: '#FFE79E' },
    ],
  },
  temperature: {
    linear: false,
    percent: false,
    style: [
      { min: -50, max: -30, icon: 'mdi:thermometer', color: 'var(--deep-purple-color)' },
      { min: -30, max: -15, icon: 'mdi:thermometer', color: 'var(--dark-blue-color)' },
      { min: -15, max: -2, icon: 'mdi:thermometer', color: 'var(--blue-color)' },
      { min: -2, max: 2, icon: 'mdi:thermometer', color: 'var(--light-blue-color)' },
      { min: 2, max: 8, icon: 'mdi:thermometer', color: 'var(--cyan-color)' },
      { min: 8, max: 16, icon: 'mdi:thermometer', color: 'var(--teal-color)' },
      { min: 16, max: 18, icon: 'mdi:thermometer', color: 'var(--green-teal-color)' },
      { min: 18, max: 20, icon: 'mdi:thermometer', color: 'var(--light-green-color)' },
      { min: 20, max: 25, icon: 'mdi:thermometer', color: 'var(--success-color)' },
      { min: 25, max: 27, icon: 'mdi:thermometer', color: 'var(--yellow-color)' },
      { min: 27, max: 29, icon: 'mdi:thermometer', color: 'var(--amber-color)' },
      { min: 29, max: 34, icon: 'mdi:thermometer', color: 'var(--deep-orange-color)' },
      { min: 34, max: 100, icon: 'mdi:thermometer', color: 'var(--red-color)' },
    ],
  },
  humidity: {
    linear: false,
    percent: true,
    style: [
      { min: 0, max: 23, icon: 'mdi:water-percent', color: 'var(--red-color)' },
      { min: 23, max: 30, icon: 'mdi:water-percent', color: 'var(--accent-color)' },
      { min: 30, max: 40, icon: 'mdi:water-percent', color: 'var(--yellow-color)' },
      { min: 40, max: 50, icon: 'mdi:water-percent', color: 'var(--success-color)' },
      { min: 50, max: 60, icon: 'mdi:water-percent', color: 'var(--teal-color)' },
      { min: 60, max: 65, icon: 'mdi:water-percent', color: 'var(--light-blue-color)' },
      { min: 65, max: 80, icon: 'mdi:water-percent', color: 'var(--indigo-color)' },
      { min: 80, max: 100, icon: 'mdi:water-percent', color: 'var(--deep-purple-color)' },
    ],
  },
  voc: {
    linear: false,
    percent: false,
    style: [
      { min: 0, max: 300, icon: 'mdi:air-filter', color: 'var(--success-color)' },
      { min: 300, max: 500, icon: 'mdi:air-filter', color: 'var(--yellow-color)' },
      { min: 500, max: 3000, icon: 'mdi:air-filter', color: 'var(--accent-color)' },
      { min: 3000, max: 25000, icon: 'mdi:air-filter', color: 'var(--red-color)' },
      { min: 25000, max: 50000, icon: 'mdi:air-filter', color: 'var(--deep-purple-color)' },
    ],
  },
  pm25: {
    linear: false,
    percent: false,
    style: [
      { min: 0, max: 12, icon: 'mdi:air-filter', color: 'var(--success-color)' },
      { min: 12, max: 35, icon: 'mdi:air-filter', color: 'var(--yellow-color)' },
      { min: 35, max: 55, icon: 'mdi:air-filter', color: 'var(--accent-color)' },
      { min: 55, max: 150, icon: 'mdi:air-filter', color: 'var(--red-color)' },
      { min: 150, max: 200, icon: 'mdi:air-filter', color: 'var(--deep-purple-color)' },
    ],
  },
};


const LANGUAGES = {
  en: {
    card: {
      msg: {
        entityError: "entity: The 'entity' parameter is required!",
        entityNotFound: 'Entity not found',
        entityUnknown: 'Unknown',
        entityUnavailable: 'Unavailable',
        attributeNotFound: 'attribute: Attribute not found in HA.',
        minValueError: 'min_value: Check your min_value.',
        maxValueError: 'max_value: Check your max_value.',
        decimalError: 'decimal: This value cannot be negative.',
      },
    },
    editor: {
      title: {
        content: 'Content',
        interaction: 'Interactions',
        theme: 'Look & Feel',
      },
      field: {
        entity: 'Entity',
        attribute: 'Attribute',
        name: 'Name',
        unit: 'Unit',
        decimal: 'decimal',
        min_value: 'Minimum value',
        max_value: 'Maximum value',
        max_value_attribute: 'Attribute (max_value)',
        tap_action: 'Tap behavior',
        hold_action: 'Hold behavior',
        icon_tap_action: 'Icon tap behavior',
        toggle_icon: 'Icon',
        toggle_name: 'Name',
        toggle_unit: 'Unit',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Bar',
        toggle_force_circular_background: 'Force circular background',
        theme: 'Theme',
        bar_size: 'Bar size',
        bar_color: 'Color for the bar',
        icon: 'Icon',
        color: 'Primary color',
        layout: 'Card layout',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimal when Low (CPU, RAM,...)',
          optimal_when_high: 'Optimal when High (Battery...)',
          light: 'Light',
          temperature: 'Temperature',
          humidity: 'Humidity',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Small',
          medium: 'Medium',
          large: 'Large',
        },
        layout: {
          horizontal: 'Horizontal (default)',
          vertical: 'Vertical',
        },
      },
    },
  },
  fr: {
    card: {
      msg: {
        entityError: "entity: Le paramètre 'entity' est requis !",
        entityNotFound: 'Entité introuvable',
        entityUnknown: 'Inconnu',
        entityUnavailable: 'Indisponible',
        attributeNotFound: 'attribute: Attribut introuvable dans HA.',
        minValueError: 'min_value: Vérifiez votre min_value.',
        maxValueError: 'max_value: Vérifiez votre max_value.',
        decimalError: 'decimal: La valeur ne peut pas être négative.',
      },
    },
    editor: {
      title: {
        content: 'Contenu',
        interaction: 'Interactions',
        theme: 'Aspect visuel et convivialité',
      },
      field: {
        entity: 'Entité',
        attribute: 'Attribut',
        name: 'Nom',
        unit: 'Unité',
        decimal: 'décimal',
        min_value: 'Valeur minimum',
        max_value: 'Valeur maximum',
        max_value_attribute: 'Attribut (max_value)',
        tap_action: "Comportement lors d'un appui court",
        hold_action: "Comportement lors d'un appui long",
        icon_tap_action: "Comportement lors de l'appui sur l'icône",
        toggle_icon: 'Icône',
        toggle_name: 'Nom',
        toggle_unit: 'Unité',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Barre',
        toggle_force_circular_background: 'Forcer le fond circulaire',
        theme: 'Thème',
        bar_size: 'Taille de la barre',
        bar_color: 'Couleur de la barre',
        icon: 'Icône',
        color: "Couleur de l'icône",
        layout: 'Disposition de la carte',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: "Optimal quand c'est bas (CPU, RAM,...)",
          optimal_when_high: "Optimal quand c'est élevé (Batterie...)",
          light: 'Lumière',
          temperature: 'Température',
          humidity: 'Humidité',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Petite',
          medium: 'Moyenne',
          large: 'Grande',
        },
        layout: {
          horizontal: 'Horizontal (par défaut)',
          vertical: 'Vertical',
        },
      },
    },
  },
  es: {
    card: {
      msg: {
        entityError: "entity: ¡El parámetro 'entity' es obligatorio!",
        entityNotFound: 'Entidad no encontrada',
        entityUnknown: 'Desconocido',
        entityUnavailable: 'No disponible',
        attributeNotFound: 'attribute: Atributo no encontrado en HA.',
        minValueError: 'min_value: Verifique su min_value.',
        maxValueError: 'max_value: Verifique su max_value.',
        decimalError: 'decimal: El valor no puede ser negativo.',
      },
    },
    editor: {
      title: {
        content: 'Contenido',
        interaction: 'Interacciones',
        theme: 'Apariencia y funcionamiento',
      },
      field: {
        entity: 'Entidad',
        attribute: 'Atributo',
        name: 'Nombre',
        unit: 'Unidad',
        decimal: 'decimal',
        min_value: 'Valor mínimo',
        max_value: 'Valor máximo',
        max_value_attribute: 'Atributo (max_value)',
        tap_action: 'Acción al pulsar brevemente',
        hold_action: 'Acción al mantener pulsado',
        icon_tap_action: 'Acción al pulsar el icono',
        toggle_icon: 'Icono',
        toggle_name: 'Nombre',
        toggle_unit: 'Unidad',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Barra',
        toggle_force_circular_background: 'Forzar fondo circular',
        theme: 'Tema',
        bar_size: 'Tamaño de la barra',
        bar_color: 'Color de la barra',
        icon: 'Icono',
        color: 'Color del icono',
        layout: 'Disposición de la tarjeta',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Óptimo cuando es bajo (CPU, RAM,...)',
          optimal_when_high: 'Óptimo cuando es alto (Batería...)',
          light: 'Luz',
          temperature: 'Temperatura',
          humidity: 'Humedad',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Pequeña',
          medium: 'Media',
          large: 'Grande',
        },
        layout: {
          horizontal: 'Horizontal (predeterminado)',
          vertical: 'Vertical',
        },
      },
    },
  },
  it: {
    card: {
      msg: {
        entityError: "entity: Il parametro 'entity' è obbligatorio!",
        entityNotFound: 'Entità non trovata',
        entityUnknown: 'Sconosciuto',
        entityUnavailable: 'Non disponibile',
        attributeNotFound: 'attribute: Attributo non trovato in HA.',
        minValueError: 'min_value: Controlla il tuo min_value.',
        maxValueError: 'max_value: Controlla il tuo max_value.',
        decimalError: 'decimal: Questo valore non può essere negativo.',
      },
    },
    editor: {
      title: {
        content: 'Contenuto',
        interaction: 'Interazioni',
        theme: 'Aspetto e funzionalità',
      },
      field: {
        entity: 'Entità',
        attribute: 'Attributo',
        name: 'Nome',
        unit: 'Unità',
        decimal: 'Decimale',
        min_value: 'Valore minimo',
        max_value: 'Valore massimo',
        max_value_attribute: 'Attributo (max_value)',
        tap_action: 'Azione al tocco breve',
        hold_action: 'Azione al tocco prolungato',
        icon_tap_action: 'Azione al tocco dell’icona',
        toggle_icon: 'Icona',
        toggle_name: 'Nome',
        toggle_unit: 'Unità',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Barra',
        toggle_force_circular_background: 'Forza sfondo circolare',
        theme: 'Tema',
        bar_size: 'Dimensione della barra',
        bar_color: 'Colore per la barra',
        icon: 'Icona',
        color: "Colore dell'icona",
        layout: 'Layout della carta',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Ottimale quando è basso (CPU, RAM,...)',
          optimal_when_high: 'Ottimale quando è alto (Batteria...)',
          light: 'Luce',
          temperature: 'Temperatura',
          humidity: 'Umidità',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Piccola',
          medium: 'Media',
          large: 'Grande',
        },
        layout: {
          horizontal: 'Orizzontale (predefinito)',
          vertical: 'Verticale',
        },
      },
    },
  },
  de: {
    card: {
      msg: {
        entityError: "entity: Der Parameter 'entity' ist erforderlich!",
        entityNotFound: 'Entität nicht gefunden',
        entityUnknown: 'Unbekannt',
        entityUnavailable: 'Nicht verfügbar',
        attributeNotFound: 'attribute: Attribut in HA nicht gefunden.',
        minValueError: 'min_value: Überprüfen Sie Ihren min_value.',
        maxValueError: 'max_value: Überprüfen Sie Ihren max_value.',
        decimalError: 'decimal: Negative Werte sind nicht zulässig.',
      },
    },
    editor: {
      title: {
        content: 'Inhalt',
        interaction: 'Interaktionen',
        theme: 'Aussehen und Bedienung',
      },
      field: {
        entity: 'Entität',
        attribute: 'Attribut',
        name: 'Name',
        unit: 'Einheit',
        decimal: 'dezimal',
        min_value: 'Mindestwert',
        max_value: 'Höchstwert',
        max_value_attribute: 'Attribut (max_value)',
        tap_action: 'Aktion bei kurzem Tippen',
        hold_action: 'Aktion bei langem Tippen',
        icon_tap_action: 'Aktion beim Tippen auf das Symbol',
        toggle_icon: 'Icon',
        toggle_name: 'Name',
        toggle_unit: 'Einheit',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Balken',
        toggle_force_circular_background: 'Kreisförmigen Hintergrund erzwingen',
        theme: 'Thema',
        bar_size: 'Größe der Bar',
        bar_color: 'Farbe für die Leiste',
        icon: 'Symbol',
        color: 'Primärfarbe',
        layout: 'Kartenlayout',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimal bei niedrig (CPU, RAM,...)',
          optimal_when_high: 'Optimal bei hoch (Batterie...)',
          light: 'Licht',
          temperature: 'Temperatur',
          humidity: 'Feuchtigkeit',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Klein',
          medium: 'Mittel',
          large: 'Groß',
        },
        layout: {
          horizontal: 'Horizontal (Standard)',
          vertical: 'Vertikal',
        },
      },
    },
  },
  nl: {
    card: {
      msg: {
        entityError: "entity: De parameter 'entity' is verplicht!",
        entityNotFound: 'Entiteit niet gevonden',
        entityUnknown: 'Onbekend',
        entityUnavailable: 'Niet beschikbaar',
        attributeNotFound: 'attribute: Attribuut niet gevonden in HA.',
        minValueError: 'min_value: Controleer je min_value.',
        maxValueError: 'max_value: Controleer je max_value.',
        decimalError: 'decimal: Deze waarde kan niet negatief zijn.',
      },
    },
    editor: {
      title: {
        content: 'Inhoud',
        interaction: 'Interactie',
        theme: 'Uiterlijk en gebruiksgemak',
      },
      field: {
        entity: 'Entiteit',
        attribute: 'Attribuut',
        name: 'Naam',
        unit: 'Eenheid',
        decimal: 'decimaal',
        min_value: 'Minimale waarde',
        max_value: 'Maximale waarde',
        max_value_attribute: 'Attribuut (max_value)',
        tap_action: 'Actie bij korte tik',
        hold_action: 'Actie bij lang ingedrukt houden',
        icon_tap_action: 'Actie bij tikken op pictogram',
        toggle_icon: 'Icoon',
        toggle_name: 'Naam',
        toggle_unit: 'Eenheid',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Balk',
        toggle_force_circular_background: 'Geforceerde cirkelvormige achtergrond',
        theme: 'Thema',
        bar_size: 'Balkgrootte',
        bar_color: 'Kleur voor de balk',
        icon: 'Pictogram',
        color: 'Primaire kleur',
        layout: 'Kaartindeling',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimaal wanneer laag (CPU, RAM,...)',
          optimal_when_high: 'Optimaal wanneer hoog (Batterij...)',
          light: 'Licht',
          temperature: 'Temperatuur',
          humidity: 'Vochtigheid',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Klein',
          medium: 'Middel',
          large: 'Groot',
        },
        layout: {
          horizontal: 'Horizontaal (standaard)',
          vertical: 'Verticaal',
        },
      },
    },
  },
  hr: {
    card: {
      msg: {
        entityError: "entity: Parametar 'entity' je obavezan!",
        entityNotFound: 'Entitet nije pronađen',
        entityUnknown: 'Nepoznat',
        entityUnavailable: 'Nedostupno',
        attributeNotFound: 'attribute: Atribut nije pronađen u HA.',
        minValueError: 'min_value: Provjerite svoj min_value.',
        maxValueError: 'max_value: Provjerite svoj max_value.',
        decimalError: 'decimal: Ova vrijednost ne može biti negativna.',
      },
    },
    editor: {
      title: {
        content: 'Sadržaj',
        interaction: 'Interakcije',
        theme: 'Izgled i funkcionalnost',
      },
      field: {
        entity: 'Entitet',
        attribute: 'Atribut',
        name: 'Ime',
        unit: 'Jedinica',
        decimal: 'decimalni',
        min_value: 'Minimalna vrijednost',
        max_value: 'Maksimalna vrijednost',
        max_value_attribute: 'Atribut (max_value)',
        tap_action: 'Radnja na kratki dodir',
        hold_action: 'Radnja na dugi dodir',
        icon_tap_action: 'Radnja na dodir ikone',
        toggle_icon: 'Ikona',
        toggle_name: 'Ime',
        toggle_unit: 'Jedinica',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Traka',
        toggle_force_circular_background: 'Prisili kružnu pozadinu',
        theme: 'Tema',
        bar_size: 'Veličina trake',
        bar_color: 'Boja za traku',
        icon: 'Ikona',
        color: 'Primarna boja',
        layout: 'Izgled kartice',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimalno kada je nisko (CPU, RAM,...)',
          optimal_when_high: 'Optimalno kada je visoko (Baterija...)',
          light: 'Svjetlo',
          temperature: 'Temperatura',
          humidity: 'Vlažnost',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Mali',
          medium: 'Srednje',
          large: 'Veliko',
        },
        layout: {
          horizontal: 'Horizontalno (zadano)',
          vertical: 'Vertikalno',
        },
      },
    },
  },
  pl: {
    card: {
      msg: {
        entityError: "entity: Parametr 'entity' jest wymagany!",
        entityNotFound: 'Encji nie znaleziono',
        entityUnknown: 'Nieznany',
        entityUnavailable: 'Niedostępny',
        attributeNotFound: 'attribute: Atrybut nie znaleziony w HA.',
        minValueError: 'min_value: Sprawdź swój min_value.',
        maxValueError: 'max_value: Sprawdź swój max_value.',
        decimalError: 'decimal: Ta wartość nie może być ujemna.',
      },
    },
    editor: {
      title: {
        content: 'Zawartość',
        interaction: 'Interakcje',
        theme: 'Wygląd i funkcjonalność',
      },
      field: {
        entity: 'Encja',
        attribute: 'Atrybut',
        name: 'Nazwa',
        unit: 'Jednostka',
        decimal: 'dziesiętny',
        min_value: 'Wartość minimalna',
        max_value: 'Wartość maksymalna',
        max_value_attribute: 'Atrybut (max_value)',
        tap_action: 'Akcja przy krótkim naciśnięciu',
        hold_action: 'Akcja przy długim naciśnięciu',
        icon_tap_action: 'Akcja przy naciśnięciu ikony',
        toggle_icon: 'Ikona',
        toggle_name: 'Nazwa',
        toggle_unit: 'Jednostka',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Pasek',
        toggle_force_circular_background: 'Wymuś okrągłe tło',
        theme: 'Motyw',
        bar_size: 'Rozmiar paska',
        bar_color: 'Kolor paska',
        icon: 'Ikona',
        color: 'Kolor podstawowy',
        layout: 'Układ karty',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optymalny, gdy niskie (CPU, RAM,...)',
          optimal_when_high: 'Optymalny, gdy wysokie (Bateria...)',
          light: 'Światło',
          temperature: 'Temperatura',
          humidity: 'Wilgotność',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Mały',
          medium: 'Średni',
          large: 'Duży',
        },
        layout: {
          horizontal: 'Poziomo (domyślnie)',
          vertical: 'Pionowy',
        },
      },
    },
  },
  mk: {
    card: {
      msg: {
        entityError: "entity: Параметарот 'entity' е задолжителен!",
        entityNotFound: 'Ентитетот не е пронајден',
        entityUnknown: 'Непознат',
        entityUnavailable: 'Недостапно',
        attributeNotFound: 'attribute: Атрибутот не е пронајден во HA.',
        minValueError: 'min_value: Проверете го вашиот min_value.',
        maxValueError: 'max_value: Проверете го вашиот max_value.',
        decimalError: 'decimal: Ова вредност не може да биде негативна.',
      },
    },
    editor: {
      title: {
        content: 'Содржина',
        interaction: 'Интеракции',
        theme: 'Изглед и функционалност',
      },
      field: {
        entity: 'Ентитет',
        attribute: 'Атрибут',
        name: 'Име',
        unit: 'Јединство',
        decimal: 'децемален',
        min_value: 'Минимална вредност',
        max_value: 'Максимална вредност',
        max_value_attribute: 'Атрибут (max_value)',
        tap_action: 'Дејство при краток допир',
        hold_action: 'Дејство при долг допир',
        icon_tap_action: 'Дејство при допир на иконата',
        toggle_icon: 'Икона',
        toggle_name: 'Име',
        toggle_unit: 'Јединство',
        toggle_secondary_info: 'Инфо',
        toggle_progress_bar: 'Лента',
        toggle_force_circular_background: 'Принуди кружна позадина',
        theme: 'Тема',
        bar_size: 'Големина на лента',
        bar_color: 'Боја за лентата',
        icon: 'Икона',
        color: 'Примарна боја',
        layout: 'Распоред на карта',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Оптимално кога е ниско(CPU, RAM,...)',
          optimal_when_high: 'Оптимално кога е високо (Батерија...)',
          light: 'Светлина',
          temperature: 'Температура',
          humidity: 'Влажност',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Мало',
          medium: 'Средно',
          large: 'Големо',
        },
        layout: {
          horizontal: 'Хоризонтално (стандардно)',
          vertical: 'Вертикално',
        },
      },
    },
  },
  pt: {
    card: {
      msg: {
        entityError: "entity: O parâmetro 'entity' é obrigatório!",
        entityNotFound: 'Entidade não encontrada',
        entityUnknown: 'Desconhecido',
        entityUnavailable: 'Indisponível',
        attributeNotFound: 'attribute: Atributo não encontrado no HA.',
        minValueError: 'min_value: Verifique o seu min_value.',
        maxValueError: 'max_value: Verifique o seu max_value.',
        decimalError: 'decimal: Este valor não pode ser negativo.',
      },
    },
    editor: {
      title: {
        content: 'Conteúdo',
        interaction: 'Interações',
        theme: 'Aparência e usabilidade',
      },
      field: {
        entity: 'Entidade',
        attribute: 'Atributo',
        name: 'Nome',
        unit: 'Unidade',
        decimal: 'decimal',
        min_value: 'Valor mínimo',
        max_value: 'Valor máximo',
        max_value_attribute: 'Atributo (max_value)',
        tap_action: 'Ação ao toque curto',
        hold_action: 'Ação ao toque longo',
        icon_tap_action: 'Ação ao tocar no ícone',
        toggle_icon: 'Ícone',
        toggle_name: 'Nome',
        toggle_unit: 'Unidade',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Barra',
        toggle_force_circular_background: 'Forçar fundo circular',
        theme: 'Tema',
        bar_size: 'Tamanho da barra',
        bar_color: 'Cor para a barra',
        icon: 'Ícone',
        color: 'Cor primária',
        layout: 'Layout do cartão',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Ótimo quando é baixo (CPU, RAM,...)',
          optimal_when_high: 'Ótimo quando é alto (Bateria...)',
          light: 'Luz',
          temperature: 'Temperatura',
          humidity: 'Humidade',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Pequeno',
          medium: 'Médio',
          large: 'Grande',
        },
        layout: {
          horizontal: 'Horizontal (padrão)',
          vertical: 'Vertical',
        },
      },
    },
  },
  da: {
    card: {
      msg: {
        entityError: "entity: Parameteren 'entity' er påkrævet!",
        entityNotFound: 'Enheden blev ikke fundet',
        entityUnknown: 'Ukendt',
        entityUnavailable: 'Utilgængelig',
        attributeNotFound: 'attribute: Attribut ikke fundet i HA.',
        minValueError: 'min_value: Tjekk din min_value.',
        maxValueError: 'max_value: Tjekk din max_value.',
        decimalError: 'decimal: Denne værdi kan ikke være negativ.',
      },
    },
    editor: {
      title: {
        content: 'Indhold',
        interaction: 'Interaktioner',
        theme: 'Udseende og funktionalitet',
      },
      field: {
        entity: 'Enhed',
        attribute: 'Attribut',
        name: 'Navn',
        unit: 'Enhed',
        decimal: 'decimal',
        min_value: 'Minimumsværdi',
        max_value: 'Maksimal værdi',
        max_value_attribute: 'Attribut (max_value)',
        tap_action: 'Handling ved kort tryk',
        hold_action: 'Handling ved langt tryk',
        icon_tap_action: 'Handling ved tryk på ikonet',
        toggle_icon: 'Ikon',
        toggle_name: 'Navn',
        toggle_unit: 'Enhed',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Bar',
        toggle_force_circular_background: 'Tving cirkulær baggrund',
        theme: 'Tema',
        bar_size: 'Bar størrelse',
        bar_color: 'Farve til bar',
        icon: 'Ikon',
        color: 'Primær farve',
        layout: 'Kort layout',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimal når lavt (CPU, RAM,...)',
          optimal_when_high: 'Optimal når højt (Batteri...)',
          light: 'Lys',
          temperature: 'Temperatur',
          humidity: 'Fugtighed',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Lille',
          medium: 'Mellem',
          large: 'Stor',
        },
        layout: {
          horizontal: 'Horisontal (standard)',
          vertical: 'Vertikal',
        },
      },
    },
  },
  nb: {
    card: {
      msg: {
        entityError: "entity: Parameteret 'entity' er påkrevd!",
        entityNotFound: 'Enheten ble ikke funnet',
        entityUnknown: 'Ukjent',
        entityUnavailable: 'Utilgjengelig',
        attributeNotFound: 'attribute: Attributt ikke funnet i HA.',
        minValueError: 'min_value: Sjekk din min_value.',
        maxValueError: 'max_value: Sjekk din max_value.',
        decimalError: 'decimal: Denne verdien kan ikke være negativ.',
      },
    },
    editor: {
      title: {
        content: 'Innhold',
        interaction: 'Interaksjoner',
        theme: 'Utseende og funksjonalitet',
      },
      field: {
        entity: 'Enhet',
        attribute: 'Attributt',
        name: 'Navn',
        unit: 'Enhet',
        decimal: 'desimal',
        min_value: 'Minste verdi',
        max_value: 'Maksimal verdi',
        max_value_attribute: 'Attributt (max_value)',
        tap_action: 'Handling ved kort trykk',
        hold_action: 'Handling ved langt trykk',
        icon_tap_action: 'Handling ved trykk på ikonet',
        toggle_icon: 'Ikon',
        toggle_name: 'Navn',
        toggle_unit: 'Enhet',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Bar',
        toggle_force_circular_background: 'Tving sirkulær bakgrunn',
        theme: 'Tema',
        bar_size: 'Bar størrelse',
        bar_color: 'Farge for baren',
        icon: 'Ikon',
        color: 'Primærfarge',
        layout: 'Kortlayout',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimal når lavt (CPU, RAM,...)',
          optimal_when_high: 'Optimal når høyt (Batteri...)',
          light: 'Lys',
          temperature: 'Temperatur',
          humidity: 'Fuktighet',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Liten',
          medium: 'Middels',
          large: 'Stor',
        },
        layout: {
          horizontal: 'Horisontal (standard)',
          vertical: 'Vertikal',
        },
      },
    },
  },
  sv: {
    card: {
      msg: {
        entityError: "entity: Parametern 'entity' är obligatorisk!",
        entityNotFound: 'Enhet ej funnen',
        entityUnknown: 'Okänd',
        entityUnavailable: 'Otillgänglig',
        attributeNotFound: 'attribute: Attributet hittades inte i HA.',
        minValueError: 'min_value: Kontrollera ditt min_value.',
        maxValueError: 'max_value: Kontrollera ditt max_value.',
        decimalError: 'decimal: Detta värde kan inte vara negativt.',
      },
    },
    editor: {
      title: {
        content: 'Innehåll',
        interaction: 'Interaktioner',
        theme: 'Utseende och funktionalitet',
      },
      field: {
        entity: 'Enhet',
        attribute: 'Attribut',
        name: 'Namn',
        unit: 'Enhet',
        decimal: 'decimal',
        min_value: 'Minsta värde',
        max_value: 'Maximalt värde',
        max_value_attribute: 'Attribut (max_value)',
        tap_action: 'Åtgärd vid kort tryck',
        hold_action: 'Åtgärd vid långt tryck',
        icon_tap_action: 'Åtgärd vid tryck på ikonen',
        toggle_icon: 'Ikon',
        toggle_name: 'Namn',
        toggle_unit: 'Enhet',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Bar',
        toggle_force_circular_background: 'Tvinga cirkulär bakgrund',
        theme: 'Tema',
        bar_size: 'Barstorlek',
        bar_color: 'Färg för baren',
        icon: 'Ikon',
        color: 'Primärfärg',
        layout: 'Kortlayout',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimal när det är lågt (CPU, RAM,...)',
          optimal_when_high: 'Optimal när det är högt (Batteri...)',
          light: 'Ljus',
          temperature: 'Temperatur',
          humidity: 'Luftfuktighet',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Liten',
          medium: 'Medium',
          large: 'Stor',
        },
        layout: {
          horizontal: 'Horisontell (standard)',
          vertical: 'Vertikal',
        },
      },
    },
  },
  el: {
    card: {
      msg: {
        entityError: "οντότητα: Η παράμετρος 'entity' είναι υποχρεωτική!",
        entityNotFound: 'Η οντότητα δεν βρέθηκε',
        entityUnknown: 'Άγνωστο',
        entityUnavailable: 'Μη διαθέσιμο',
        attributeNotFound: 'χαρακτηριστικό: Το χαρακτηριστικό δεν βρέθηκε στο HA.',
        minValueError: 'min_value: Ελέγξτε την ελάχιστη τιμή.',
        maxValueError: 'max_value: Ελέγξτε τη μέγιστη τιμή.',
        decimalError: 'decimal: Αυτή η τιμή δεν μπορεί να είναι αρνητική.',
      },
    },
    editor: {
      title: {
        content: 'Περιεχόμενο',
        interaction: 'Αλληλεπιδράσεις',
        theme: 'Εμφάνιση',
      },
      field: {
        entity: 'Οντότητα',
        attribute: 'Χαρακτηριστικό',
        name: 'Όνομα',
        unit: 'Μονάδα',
        decimal: 'δεκαδικά',
        min_value: 'Ελάχιστη τιμή',
        max_value: 'Μέγιστη τιμή',
        max_value_attribute: 'Χαρακτηριστικό (max_value)',
        tap_action: 'Ενέργεια κατά το σύντομο πάτημα',
        hold_action: 'Ενέργεια κατά το παρατεταμένο πάτημα',
        icon_tap_action: 'Ενέργεια στο πάτημα του εικονιδίου',
        toggle_icon: 'Εικονίδιο',
        toggle_name: 'Όνομα',
        toggle_unit: 'Μονάδα',
        toggle_secondary_info: 'Πληροφορίες',
        toggle_progress_bar: 'Γραμμή',
        toggle_force_circular_background: 'Εξαναγκασμός κυκλικού φόντου',
        theme: 'Θέμα',
        bar_size: 'Μέγεθος γραμμής',
        bar_color: 'Χρώμα γραμμής',
        icon: 'Εικονίδιο',
        color: 'Κύριο χρώμα',
        layout: 'Διάταξη κάρτας',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Βέλτιστο όταν είναι χαμηλό (CPU, RAM...)',
          optimal_when_high: 'Βέλτιστο όταν είναι υψηλό (Μπαταρία...)',
          light: 'Φωτεινότητα',
          temperature: 'Θερμοκρασία',
          humidity: 'Υγρασία',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Μικρό',
          medium: 'Μεσαίο',
          large: 'Μεγάλο',
        },
        layout: {
          horizontal: 'Οριζόντια (προεπιλογή)',
          vertical: 'Κατακόρυφη',
        },
      },
    },
  },
  fi: {
    card: {
      msg: {
        entityError: "entiteetti: 'entity'-parametri on pakollinen!",
        entityNotFound: 'Entiteettiä ei löydy',
        entityUnknown: 'Tuntematon',
        entityUnavailable: 'Ei saatavilla',
        attributeNotFound: 'attribuutti: Attribuuttia ei löydy HA:sta.',
        minValueError: 'min_value: Tarkista minimiarvo.',
        maxValueError: 'max_value: Tarkista maksimiarvo.',
        decimalError: 'decimal: Arvo ei voi olla negatiivinen.',
      },
    },
    editor: {
      title: {
        content: 'Sisältö',
        interaction: 'Vuorovaikutukset',
        theme: 'Ulkoasu',
      },
      field: {
        entity: 'Entiteetti',
        attribute: 'Attribuutti',
        name: 'Nimi',
        unit: 'Yksikkö',
        decimal: 'desimaali',
        min_value: 'Minimiarvo',
        max_value: 'Maksimiarvo',
        max_value_attribute: 'Attribuutti (max_value)',
        tap_action: 'Toiminto lyhyellä napautuksella',
        hold_action: 'Toiminto pitkällä painalluksella',
        icon_tap_action: 'Toiminto kuvaketta napautettaessa',
        toggle_icon: 'Ikoni',
        toggle_name: 'Nimi',
        toggle_unit: 'Yksikkö',
        toggle_secondary_info: 'Tiedot',
        toggle_progress_bar: 'Palkki',
        toggle_force_circular_background: 'Pakota pyöreä tausta',
        theme: 'Teema',
        bar_size: 'Palkin koko',
        bar_color: 'Palkin väri',
        icon: 'Ikoni',
        color: 'Pääväri',
        layout: 'Kortin asettelu',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optimaalinen alhaisena (CPU, RAM...)',
          optimal_when_high: 'Optimaalinen korkeana (Akku...)',
          light: 'Valoisuus',
          temperature: 'Lämpötila',
          humidity: 'Kosteus',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Pieni',
          medium: 'Keskikokoinen',
          large: 'Suuri',
        },
        layout: {
          horizontal: 'Vaakasuora (oletus)',
          vertical: 'Pystysuora',
        },
      },
    },
  },
  ro: {
    card: {
      msg: {
        entityError: "entitate: Parametrul 'entity' este obligatoriu!",
        entityNotFound: 'Entitatea nu a fost găsită',
        entityUnknown: 'Necunoscut',
        entityUnavailable: 'Indisponibil',
        attributeNotFound: 'atribut: Atributul nu a fost găsit în HA.',
        minValueError: 'min_value: Verifică valoarea minimă.',
        maxValueError: 'max_value: Verifică valoarea maximă.',
        decimalError: 'decimal: Această valoare nu poate fi negativă.',
      },
    },
    editor: {
      title: {
        content: 'Conținut',
        interaction: 'Interacțiuni',
        theme: 'Aspect & Stil',
      },
      field: {
        entity: 'Entitate',
        attribute: 'Atribut',
        name: 'Nume',
        unit: 'Unitate',
        decimal: 'zecimal',
        min_value: 'Valoare minimă',
        max_value: 'Valoare maximă',
        max_value_attribute: 'Atribut (max_value)',
        tap_action: 'Acțiune la apăsare scurtă',
        hold_action: 'Acțiune la apăsare lungă',
        icon_tap_action: 'Acțiune la apăsarea pictogramei',
        toggle_icon: 'Pictogramă',
        toggle_name: 'Nume',
        toggle_unit: 'Unitate',
        toggle_secondary_info: 'Info',
        toggle_progress_bar: 'Bară',
        toggle_force_circular_background: 'Forțează fundal circular',
        theme: 'Temă',
        bar_size: 'Dimensiunea barei',
        bar_color: 'Culoare bară',
        icon: 'Pictogramă',
        color: 'Culoare principală',
        layout: 'Aspectul cardului',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Optim când este scăzut (CPU, RAM...)',
          optimal_when_high: 'Optim când este ridicat (Baterie...)',
          light: 'Luminozitate',
          temperature: 'Temperatură',
          humidity: 'Umiditate',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Mic',
          medium: 'Mediu',
          large: 'Mare',
        },
        layout: {
          horizontal: 'Orizontal (implicit)',
          vertical: 'Vertical',
        },
      },
    },
  },
  zh: {
    card: {
      msg: {
        entityError: "entity：必须提供 'entity' 参数！",
        entityNotFound: '未找到实体',
        entityUnknown: '未知',
        entityUnavailable: '不可用',
        attributeNotFound: 'attribute：HA 中未找到该属性。',
        minValueError: 'min_value：请检查最小值。',
        maxValueError: 'max_value：请检查最大值。',
        decimalError: 'decimal：该值不能为负数。',
      },
    },
    editor: {
      title: {
        content: '内容',
        interaction: '交互',
        theme: '外观',
      },
      field: {
        entity: '实体',
        attribute: '属性',
        name: '名称',
        unit: '单位',
        decimal: '小数',
        min_value: '最小值',
        max_value: '最大值',
        max_value_attribute: '属性（最大值）',
        tap_action: '短按时的操作',
        hold_action: '长按时的操作',
        icon_tap_action: '点击图标时的操作',
        toggle_icon: '图标',
        toggle_name: '名称',
        toggle_unit: '单位',
        toggle_secondary_info: '信息',
        toggle_progress_bar: '进度条',
        toggle_force_circular_background: '强制圆形背景',
        theme: '主题',
        bar_size: '条形大小',
        bar_color: '条形颜色',
        icon: '图标',
        color: '主色',
        layout: '卡片布局',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: '低值最佳（CPU、内存等）',
          optimal_when_high: '高值最佳（电池等）',
          light: '亮度',
          temperature: '温度',
          humidity: '湿度',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: '小',
          medium: '中',
          large: '大',
        },
        layout: {
          horizontal: '水平（默认）',
          vertical: '垂直',
        },
      },
    },
  },
  ja: {
    card: {
      msg: {
        entityError: 'entity：「entity」パラメータは必須です！',
        entityNotFound: 'エンティティが見つかりません',
        entityUnknown: '不明',
        entityUnavailable: '利用不可',
        attributeNotFound: 'attribute：HA に属性が見つかりませんでした。',
        minValueError: 'min_value：最小値を確認してください。',
        maxValueError: 'max_value：最大値を確認してください。',
        decimalError: 'decimal：負の値は使用できません。',
      },
    },
    editor: {
      title: {
        content: 'コンテンツ',
        interaction: 'インタラクション',
        theme: '外観',
      },
      field: {
        entity: 'エンティティ',
        attribute: '属性',
        name: '名前',
        unit: '単位',
        decimal: '小数点',
        min_value: '最小値',
        max_value: '最大値',
        max_value_attribute: '属性（最大値）',
        tap_action: '短くタップしたときの動作',
        hold_action: '長押ししたときの動作',
        icon_tap_action: 'アイコンをタップしたときの動作',
        toggle_icon: 'アイコン',
        toggle_name: '名前',
        toggle_unit: '単位',
        toggle_secondary_info: '情報',
        toggle_progress_bar: 'バー',
        toggle_force_circular_background: '円形の背景を強制する',
        theme: 'テーマ',
        bar_size: 'バーサイズ',
        bar_color: 'バーの色',
        icon: 'アイコン',
        color: 'メインカラー',
        layout: 'カードレイアウト',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: '低い時が最適（CPU、RAMなど）',
          optimal_when_high: '高い時が最適（バッテリーなど）',
          light: '明るさ',
          temperature: '温度',
          humidity: '湿度',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: '小',
          medium: '中',
          large: '大',
        },
        layout: {
          horizontal: '水平（デフォルト）',
          vertical: '垂直',
        },
      },
    },
  },
  ko: {
    card: {
      msg: {
        entityError: "entity: 'entity' 매개변수는 필수입니다!",
        entityNotFound: '엔티티를 찾을 수 없습니다',
        entityUnknown: '알 수 없음',
        entityUnavailable: '사용 불가',
        attributeNotFound: 'attribute: HA에서 속성을 찾을 수 없습니다.',
        minValueError: 'min_value: 최소값을 확인하세요.',
        maxValueError: 'max_value: 최대값을 확인하세요.',
        decimalError: 'decimal: 음수는 허용되지 않습니다.',
      },
    },
    editor: {
      title: {
        content: '콘텐츠',
        interaction: '상호작용',
        theme: '테마 및 스타일',
      },
      field: {
        entity: '엔티티',
        attribute: '속성',
        name: '이름',
        unit: '단위',
        decimal: '소수점',
        min_value: '최소값',
        max_value: '최대값',
        max_value_attribute: '속성 (최대값)',
        tap_action: '짧게 탭 시 동작',
        hold_action: '길게 누를 시 동작',
        icon_tap_action: '아이콘 탭 시 동작',
        toggle_icon: '아이콘',
        toggle_name: '이름',
        toggle_unit: '단위',
        toggle_secondary_info: '정보',
        toggle_progress_bar: '진행 바',
        toggle_force_circular_background: '원형 배경 강제 적용',
        theme: '테마',
        bar_size: '바 크기',
        bar_color: '바 색상',
        icon: '아이콘',
        color: '기본 색상',
        layout: '카드 레이아웃',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: '낮을 때 최적 (CPU, RAM 등)',
          optimal_when_high: '높을 때 최적 (배터리 등)',
          light: '조도',
          temperature: '온도',
          humidity: '습도',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: '작음',
          medium: '보통',
          large: '큼',
        },
        layout: {
          horizontal: '수평 (기본)',
          vertical: '수직',
        },
      },
    },
  },
  tr: {
    card: {
      msg: {
        entityError: "entity: 'entity' parametresi gereklidir!",
        entityNotFound: 'Varlık bulunamadı',
        entityUnknown: 'Bilinmeyen',
        entityUnavailable: 'Kullanılamıyor',
        attributeNotFound: 'attribute: HA içinde öznitelik bulunamadı.',
        minValueError: 'min_value: Minimum değeri kontrol edin.',
        maxValueError: 'max_value: Maksimum değeri kontrol edin.',
        decimalError: 'decimal: Bu değer negatif olamaz.',
      },
    },
    editor: {
      title: {
        content: 'İçerik',
        interaction: 'Etkileşimler',
        theme: 'Görünüm',
      },
      field: {
        entity: 'Varlık',
        attribute: 'Öznitelik',
        name: 'Ad',
        unit: 'Birim',
        decimal: 'ondalık',
        min_value: 'Minimum değer',
        max_value: 'Maksimum değer',
        max_value_attribute: 'Öznitelik (max_value)',
        tap_action: 'Kısa dokunma davranışı',
        hold_action: 'Uzun basma davranışı',
        icon_tap_action: 'Simgeye dokunma davranışı',
        toggle_icon: 'Simge',
        toggle_name: 'Ad',
        toggle_unit: 'Birim',
        toggle_secondary_info: 'Bilgi',
        toggle_progress_bar: 'Çubuk',
        toggle_force_circular_background: 'Dairesel arka planı zorla',
        theme: 'Tema',
        bar_size: 'Çubuk boyutu',
        bar_color: 'Çubuk rengi',
        icon: 'Simge',
        color: 'Birincil renk',
        layout: 'Kart düzeni',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'Düşükken en iyi (CPU, RAM...)',
          optimal_when_high: 'Yüksekken en iyi (Pil...)',
          light: 'Işık',
          temperature: 'Sıcaklık',
          humidity: 'Nem',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'Küçük',
          medium: 'Orta',
          large: 'Büyük',
        },
        layout: {
          horizontal: 'Yatay (varsayılan)',
          vertical: 'Dikey',
        },
      },
    },
  },
  ar: {
    card: {
      msg: {
        entityError: "الكيان: المعامل 'entity' مطلوب!",
        entityNotFound: 'لم يتم العثور على الكيان',
        entityUnknown: 'غير معروف',
        entityUnavailable: 'غير متاح',
        attributeNotFound: 'السمة: السمة غير موجودة في HA.',
        minValueError: 'min_value: تحقق من القيمة الدنيا.',
        maxValueError: 'max_value: تحقق من القيمة القصوى.',
        decimalError: 'decimal: لا يمكن أن تكون هذه القيمة سالبة.',
      },
    },
    editor: {
      title: {
        content: 'المحتوى',
        interaction: 'التفاعلات',
        theme: 'المظهر',
      },
      field: {
        entity: 'الكيان',
        attribute: 'السمة',
        name: 'الاسم',
        unit: 'الوحدة',
        decimal: 'عشري',
        min_value: 'القيمة الدنيا',
        max_value: 'القيمة القصوى',
        max_value_attribute: 'السمة (max_value)',
        tap_action: 'الإجراء عند النقر القصير',
        hold_action: 'الإجراء عند الضغط المطول',
        icon_tap_action: 'الإجراء عند النقر على الأيقونة',
        toggle_icon: 'أيقونة',
        toggle_name: 'الاسم',
        toggle_unit: 'الوحدة',
        toggle_secondary_info: 'معلومات',
        toggle_progress_bar: 'شريط',
        toggle_force_circular_background: 'فرض خلفية دائرية',
        theme: 'السمة',
        bar_size: 'حجم الشريط',
        bar_color: 'لون الشريط',
        icon: 'أيقونة',
        color: 'اللون الأساسي',
        layout: 'تخطيط البطاقة',
      },
      option: {
        theme: {
          '': '',
          optimal_when_low: 'مثالي عند الانخفاض (CPU، RAM...)',
          optimal_when_high: 'مثالي عند الارتفاع (البطارية...)',
          light: 'الضوء',
          temperature: 'درجة الحرارة',
          humidity: 'الرطوبة',
          pm25: 'PM2.5',
          voc: 'VOC',
        },
        bar_size: {
          small: 'صغير',
          medium: 'متوسط',
          large: 'كبير',
        },
        layout: {
          horizontal: 'أفقي (افتراضي)',
          vertical: 'رأسي',
        },
      },
    },
  },
};

const EDITOR_INPUT_FIELDS = {
  basicConfiguration: {
    entity: {
      name: 'entity',
      type: CARD.editor.fields.entity.type,
      width: '100%',
      isInGroup: null,
      schema: [{ name: 'entity', required: true, selector: { entity: {} } }],
    },
    attribute: {
      name: 'attribute',
      type: CARD.editor.fields.attribute.type,
      width: '100%',
      isInGroup: CARD.editor.keyMappings.attribute,
    },
  },
  content: {
    title: {
      name: 'content',
      icon: 'mdi:text-short',
    },
    field: {
      name: {
        name: 'name',
        type: CARD.editor.fields.default.type,
        width: '100%',
        isInGroup: null,
      },
      unit: {
        name: 'unit',
        type: CARD.editor.fields.default.type,
        width: 'calc((100% - 20px) * 0.2)',
        isInGroup: null,
      },

      decimal: {
        name: 'decimal',
        type: CARD.editor.fields.number.type,
        width: 'calc((100% - 20px) * 0.2)',
        isInGroup: null,
      },
      min_value: {
        name: 'min_value',
        type: CARD.editor.fields.number.type,
        width: 'calc((100% - 20px) * 0.6)',
        isInGroup: null,
      },
      max_value: {
        name: 'max_value',
        type: CARD.editor.fields.default.type,
        width: '100%',
        isInGroup: null,
      },
      max_value_attribute: {
        name: 'max_value_attribute',
        type: CARD.editor.fields.max_value_attribute.type,
        width: '100%',
        isInGroup: CARD.editor.keyMappings.max_value_attribute,
      },
    },
  },
  interaction: {
    title: {
      name: 'interaction',
      icon: 'mdi:gesture-tap-hold',
    },
    field: {
      tap_action: {
        name: 'tap_action',
        type: CARD.editor.fields.tap_action.type,
        isInGroup: null,
        width: '100%',
        schema: [{ name: 'tap_action', selector: { 'ui-action': {} } }],
      },
      hold_action: {
        name: 'hold_action',
        type: CARD.editor.fields.tap_action.type,
        isInGroup: null,
        width: '100%',
        schema: [{ name: 'hold_action', selector: { 'ui-action': {} } }],
      },
      icon_tap_action: {
        name: 'icon_tap_action',
        type: CARD.editor.fields.icon_tap_action.type,
        isInGroup: null,
        width: '100%',
        schema: [{ name: 'icon_tap_action', selector: { 'ui-action': {} }}],
      },
    },
  },
  theme: {
    title: {
      name: 'theme',
      icon: 'mdi:list-box',
    },
    field: {
      toggleIcon: {
        name: 'toggle_icon',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      toggleName: {
        name: 'toggle_name',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      toggleUnit: {
        name: 'toggle_unit',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      toggleSecondaryInfo: {
        name: 'toggle_secondary_info',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      toggleBar: {
        name: 'toggle_progress_bar',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      toggleCircular: {
        name: 'toggle_force_circular_background',
        type: CARD.editor.fields.toggle.type,
        width: '100%',
        isInGroup: null,
      },
      theme: {
        name: 'theme',
        type: CARD.editor.fields.theme.type,
        width: '100%',
        isInGroup: null,
      },
      bar_size: {
        name: 'bar_size',
        type: CARD.editor.fields.bar_size.type,
        width: 'calc((100% - 10px) * 0.5)',
        isInGroup: null,
      },
      bar_color: {
        name: 'bar_color',
        type: CARD.editor.fields.color.type,
        width: 'calc((100% - 10px) * 0.5)',
        isInGroup: CARD.editor.keyMappings.theme,
        schema: [{ name: 'bar_color', selector: { 'ui-color': {} } }],
      },
      icon: {
        name: 'icon',
        type: CARD.editor.fields.icon.type,
        width: 'calc((100% - 10px) * 0.5)',
        isInGroup: null,
        schema: [{ name: 'icon', selector: { icon: { icon_set: ['mdi'] } } }],
      },
      color: {
        name: 'color',
        type: CARD.editor.fields.color.type,
        width: 'calc((100% - 10px) * 0.5)',
        isInGroup: CARD.editor.keyMappings.theme,
        schema: [{ name: 'color', selector: { 'ui-color': {} } }],
      },
      layout: {
        name: 'layout',
        type: CARD.editor.fields.layout.type,
        width: '100%',
        isInGroup: null,
      },
    },
  },
};

const FIELD_OPTIONS = {
  theme: [
    {
      value: '',
      icon: 'mdi:cancel',
    },
    {
      value: 'optimal_when_low',
      icon: 'mdi:arrow-collapse-down',
    },
    {
      value: 'optimal_when_high',
      icon: 'mdi:arrow-collapse-up',
    },
    {
      value: 'light',
      icon: 'mdi:lightbulb',
    },
    {
      value: 'temperature',
      icon: 'mdi:thermometer',
    },
    {
      value: 'humidity',
      icon: 'mdi:water-percent',
    },
    {
      value: 'pm25',
      icon: 'mdi:air-filter',
    },
    {
      value: 'voc',
      icon: 'mdi:air-filter',
    },
  ],
  bar_size: [
    {
      value: CARD.style.bar.sizeOptions.small.label,
      icon: CARD.style.bar.sizeOptions.small.mdi,
    },
    {
      value: CARD.style.bar.sizeOptions.medium.label,
      icon: CARD.style.bar.sizeOptions.medium.mdi,
    },
    {
      value: CARD.style.bar.sizeOptions.large.label,
      icon: CARD.style.bar.sizeOptions.large.mdi,
    },
  ],
  layout: [
    {
      value: CARD.layout.orientations.horizontal.label,
      icon: CARD.layout.orientations.horizontal.mdi,
    },
    {
      value: CARD.layout.orientations.vertical.label,
      icon: CARD.layout.orientations.vertical.mdi,
    },
  ],
};

const ATTRIBUTE_MAPPING = {
  cover: { label: 'cover', attribute: 'current_position' },
  light: { label: 'light', attribute: 'brightness' },
  fan: { label: 'fan', attribute: 'percentage' },
  climate: { label: 'climate', attribute: null },
  humidifier: { label: 'humidifier', attribute: null },
  media_player: { label: 'media_player', attribute: null },
  vacuum: { label: 'vacuum', attribute: null },
  device_tracker: { label: 'device_tracker', attribute: null },
  weather: { label: 'weather', attribute: null },
};

const CARD_HTML = `
    <!-- Main container -->
    <${CARD.htmlStructure.sections.container.element} class="${CARD.htmlStructure.sections.container.class}">
        <!-- icon/shape -->
        <${CARD.htmlStructure.sections.left.element} class="${CARD.htmlStructure.sections.left.class}">
            <${CARD.htmlStructure.elements.shape.element} class="${CARD.htmlStructure.elements.shape.class}"></${CARD.htmlStructure.elements.shape.element}>
            <${CARD.htmlStructure.elements.icon.element} class="${CARD.htmlStructure.elements.icon.class}"></${CARD.htmlStructure.elements.icon.element}>
            <${CARD.htmlStructure.elements.badge.container.element} class="${CARD.htmlStructure.elements.badge.container.class}">
                <${CARD.htmlStructure.elements.badge.icon.element} class="${CARD.htmlStructure.elements.badge.icon.class}"></${CARD.htmlStructure.elements.badge.icon.element}>
            </${CARD.htmlStructure.elements.badge.container.element}>
        </${CARD.htmlStructure.sections.left.element}>

        <!-- infos/progress bar -->
        <${CARD.htmlStructure.sections.right.element} class="${CARD.htmlStructure.sections.right.class}">
            <${CARD.htmlStructure.elements.name.element} class="${CARD.htmlStructure.elements.name.class}"></${CARD.htmlStructure.elements.name.element}>
            <${CARD.htmlStructure.elements.secondaryInfo.element} class="${CARD.htmlStructure.elements.secondaryInfo.class}">
                <${CARD.htmlStructure.elements.percentage.element} class="${CARD.htmlStructure.elements.percentage.class}"></${CARD.htmlStructure.elements.percentage.element}>
                <${CARD.htmlStructure.elements.progressBar.container.element} class="${CARD.htmlStructure.elements.progressBar.container.class}">
                    <${CARD.htmlStructure.elements.progressBar.bar.element} class="${CARD.htmlStructure.elements.progressBar.bar.class}">
                        <${CARD.htmlStructure.elements.progressBar.inner.element} class="${CARD.htmlStructure.elements.progressBar.inner.class}"></${CARD.htmlStructure.elements.progressBar.inner.element}>
                    </${CARD.htmlStructure.elements.progressBar.bar.element}>
                </${CARD.htmlStructure.elements.progressBar.container.element}>
            </${CARD.htmlStructure.elements.secondaryInfo.element}>
        </${CARD.htmlStructure.sections.right.element}>
    </${CARD.htmlStructure.sections.container.element}>
    <!-- HA Alert -->
    <${CARD.htmlStructure.alert.container.element}>
        <${CARD.htmlStructure.alert.icon.element} class="${CARD.htmlStructure.alert.icon.class}"></${CARD.htmlStructure.alert.icon.element}>
        <${CARD.htmlStructure.alert.message.element} class="${CARD.htmlStructure.alert.message.class}"></${CARD.htmlStructure.alert.message.element}>
    </${CARD.htmlStructure.alert.container.element}>
`;

const CARD_CSS = `
    ${CARD.htmlStructure.card.element} {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0;
        box-sizing: border-box;
        margin: 0 auto;
        overflow: hidden;
    }

    .${CARD.style.dynamic.clickable.card} {
        cursor: pointer;
    }

    .${CARD.style.dynamic.clickable.card}:hover {
        background-color: color-mix(in srgb, var(--card-background-color) 96%, var(${CARD.style.dynamic.iconAndShape.color.var}, ${CARD.style.dynamic.iconAndShape.color.default}) 4%);
    }

    .${CARD.style.dynamic.clickable.card}:active {
        background-color: color-mix(in srgb, var(--card-background-color) 85%, var(${CARD.style.dynamic.iconAndShape.color.var}, ${CARD.style.dynamic.iconAndShape.color.default}) 15%);
        transition: background-color 0.5s ease;
    }

    /* main container */
    .${CARD.htmlStructure.sections.container.class},
    ${CARD.htmlStructure.alert.container.element} {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0px 10px;
        gap: 10px;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.sections.container.class}, .${CARD.layout.orientations.vertical.label} ${CARD.htmlStructure.alert.container.element} {
        min-height: ${CARD.layout.orientations.vertical.minHeight};
        flex-direction: column;
    }
    .${CARD.layout.orientations.horizontal.label} .${CARD.htmlStructure.sections.container.class}, .${CARD.layout.orientations.horizontal.label} ${CARD.htmlStructure.alert.container.element} {
        min-height: ${CARD.layout.orientations.horizontal.minHeight};
        flex-direction: row;
    }

    /* .left: icon & shape */
    .${CARD.htmlStructure.sections.left.class}, .${CARD.htmlStructure.alert.icon.class} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
    }

    .${CARD.layout.orientations.vertical.label}.${CARD.style.bar.sizeOptions.small.label} .${CARD.htmlStructure.sections.left.class} {
        margin-top: 10px;
    }

    .${CARD.layout.orientations.vertical.label}.${CARD.style.bar.sizeOptions.medium.label} .${CARD.htmlStructure.sections.left.class} {
        margin-top: 12px;
    }

    .${CARD.layout.orientations.vertical.label}.${CARD.style.bar.sizeOptions.large.label} .${CARD.htmlStructure.sections.left.class} {
        margin-top: 14px;
    }

    .${CARD.htmlStructure.elements.shape.class} {
        display: block;
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(${CARD.style.dynamic.iconAndShape.color.var}, ${CARD.style.dynamic.iconAndShape.color.default});
        opacity: 0.2;
    }
    
    .${CARD.htmlStructure.elements.icon.class} {
        position: relative;
        z-index: 1;
        width: 24px;
        height: 24px;
        color: var(${CARD.style.dynamic.iconAndShape.color.var}, ${CARD.style.dynamic.iconAndShape.color.default});
    }
    .${CARD.style.dynamic.clickable.icon} .${CARD.htmlStructure.sections.left.class}:hover {
        cursor: pointer;
    }   
        
    .${CARD.style.dynamic.clickable.icon} .${CARD.htmlStructure.sections.left.class}:hover .${CARD.htmlStructure.elements.shape.class} {
        opacity: 0.4;
    }

    /* .right: name & percentage */
    .${CARD.htmlStructure.sections.right.class},
    .${CARD.htmlStructure.alert.message.class} {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        overflow: hidden;
        width:100%;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.sections.right.class} {
        flex-grow: 0;
    }

    .${CARD.htmlStructure.elements.name.class} {
        width: 100%;
        min-width: 0;
        height: 20px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.1px;
        text-align: left;

        color: var(--primary-text-color);
    }

    .${CARD.htmlStructure.elements.secondaryInfo.class} {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.secondaryInfo.class} {
        display: block;
    }

    .${CARD.htmlStructure.elements.percentage.class} {
        display: flex;
        align-items: center;
        height: 16px;
        min-width: 45px;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;
        color: var(--primary-text-color);
    }

    .${CARD.style.dynamic.secondaryInfoError.class} .${CARD.htmlStructure.elements.percentage.class} {
        display: inline-block; /* Change de flex à inline-block */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    /* Progress bar */
    .${CARD.htmlStructure.elements.progressBar.container.class} {
        flex-grow: 1;
        height: 16px; /* Même hauteur que le pourcentage */
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .${CARD.htmlStructure.elements.progressBar.bar.class} {
        width: 100%;
        height: ${CARD.style.bar.sizeOptions.small.size};
        max-height: ${CARD.style.bar.sizeOptions.large.size};
        background-color: var(--divider-color);
        border-radius: ${CARD.style.bar.radius};
        overflow: hidden;
        position: relative;
    }
    
    .${CARD.style.dynamic.progressBar.orientation.rtl} .${CARD.htmlStructure.elements.progressBar.bar.class} {
        transform: scaleX(-1);
    }

    .${CARD.style.bar.sizeOptions.small.label} .${CARD.htmlStructure.elements.progressBar.bar.class} {
        height: ${CARD.style.bar.sizeOptions.small.size};
        max-height: ${CARD.style.bar.sizeOptions.small.size};
    }

    .${CARD.style.bar.sizeOptions.medium.label} .${CARD.htmlStructure.elements.progressBar.bar.class} {
        height: ${CARD.style.bar.sizeOptions.medium.size};
        max-height: ${CARD.style.bar.sizeOptions.medium.size};
   }

    .${CARD.style.bar.sizeOptions.large.label} .${CARD.htmlStructure.elements.progressBar.bar.class} {
        height: ${CARD.style.bar.sizeOptions.large.size};
        max-height: ${CARD.style.bar.sizeOptions.large.size};
   }

    .${CARD.htmlStructure.elements.progressBar.inner.class} {
        height: 100%;
        width: var(${CARD.style.dynamic.progressBar.size.var}, ${CARD.style.dynamic.progressBar.size.default});
        background-color: var(${CARD.style.dynamic.progressBar.color.var}, ${CARD.style.dynamic.progressBar.color.default});
        transition: width 0.3s ease;
        will-change: width;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.name.class} {
        text-align: center;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.style.bar.sizeOptions.large.label} .${CARD.htmlStructure.elements.name.class} {
        height: 18px;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.percentage.class} {
        align-items: center;
        justify-content: center;
    }

    .${CARD.style.bar.sizeOptions.small.label} .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.percentage.class} {
        margin-bottom: 1px;
    }

    .${CARD.style.bar.sizeOptions.medium.label} .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.percentage.class} {
        height: 15px;
        font-size: 0.8em;
    }

    .${CARD.style.bar.sizeOptions.large.label} .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.percentage.class} {
        height: 13px;
        font-size: 0.8em;
    }

    ${CARD.htmlStructure.alert.container.element} {
        display: none;
        position: absolute;
        z-index: 3;
        background-color: color-mix(in srgb, var(--card-background-color) 80%, var(--state-icon-color) 20%);
        border-radius: var(ha-card-border-radius);
        margin: 0;
    }

    .${CARD.style.dynamic.show}-${CARD.htmlStructure.alert.container.element} ${CARD.htmlStructure.alert.container.element}{
        display: flex;
    }

    .${CARD.htmlStructure.alert.icon.class} {
        color: ${CARD.style.icon.alert.color};
        margin-left: 10px;
    }

    .${CARD.htmlStructure.alert.message.class} {
        margin-right: 8px;
        letter-spacing: 0.1px;
    }

    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.alert.icon.class} {
      margin-top: 10px;
      margin-left: 0px;
      width: auto;
      height: auto;
    }
    .${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.alert.message.class} {
      margin: 0px;
      padding: 0px 10px;
      width: auto;
      height: auto;
      display: flex;
      justify-content: flex-start;
    }

    .${CARD.editor.fields.container.class} {
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding-bottom: 70px;
    }

    .${CARD.style.dynamic.hide}-${CARD.editor.keyMappings.attribute} .${CARD.editor.keyMappings.attribute},
    .${CARD.style.dynamic.hide}-${CARD.editor.keyMappings.max_value_attribute} .${CARD.editor.keyMappings.max_value_attribute},
    .${CARD.style.dynamic.hide}-${CARD.editor.keyMappings.theme} .${CARD.editor.keyMappings.theme} {
        display: none;
    }

    .${CARD.editor.fields.iconItem.class} {
        margin-right: 8px;
        width: 20px;
        height: 20px;
    }

    .${CARD.documentation.link.class} {
        text-decoration: none;
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 600;
    }

    .${CARD.documentation.shape.class} {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
    }
    .${CARD.documentation.shape.class}:hover {
        background-color: color-mix(in srgb, var(--card-background-color) 90%, var(--secondary-text-color) 10%);
    }

    .${CARD.documentation.questionMark.class} {
        color: var(--primary-text-color);
    }

    .${CARD.htmlStructure.elements.badge.container.class} {
        position: absolute;
        z-index: 2;
        top: -3px;
        right: -3px;
        inset-inline-end: -3px;
        inset-inline-start: initial;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background-color: var(${CARD.style.dynamic.badge.backgroundColor.var}, ${CARD.style.dynamic.badge.backgroundColor.default});
        display: none;
        align-items: center;
        justify-content: center;
    }

    .${CARD.style.dynamic.show}-${CARD.htmlStructure.elements.badge.container.class} .${CARD.htmlStructure.elements.badge.container.class} {
        display: flex;
    }

    .${CARD.htmlStructure.elements.badge.container.class} .${CARD.htmlStructure.elements.badge.icon.class} {
        height: 12px;
        width: 12px;
        display: flex; /* h/w ratio */
        align-items: center;
        justify-content: center;
        color: var(${CARD.style.dynamic.badge.color.var}, ${CARD.style.dynamic.badge.color.default});
    }

    .${CARD.style.dynamic.hiddenComponent.icon.class} .${CARD.htmlStructure.sections.left.class},
    .${CARD.style.dynamic.hiddenComponent.name.class} .${CARD.htmlStructure.elements.name.class},
    .${CARD.style.dynamic.hiddenComponent.shape.class} .${CARD.htmlStructure.elements.shape.class},
    .${CARD.style.dynamic.hiddenComponent.progress_bar.class} .${CARD.htmlStructure.elements.progressBar.bar.class},
    .${CARD.style.dynamic.hiddenComponent.secondary_info.class} .${CARD.htmlStructure.elements.percentage.class} {
        display: none;
    }

    .${CARD.style.dynamic.hiddenComponent.icon.class}.${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.sections.left.class},
    .${CARD.style.dynamic.hiddenComponent.name.class}.${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.name.class},
    .${CARD.style.dynamic.hiddenComponent.shape.class}.${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.shape.class},
    .${CARD.style.dynamic.hiddenComponent.progress_bar.class}.${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.progressBar.bar.class},
    .${CARD.style.dynamic.hiddenComponent.secondary_info.class}.${CARD.layout.orientations.vertical.label} .${CARD.htmlStructure.elements.percentage.class} {
        display: flex;
        visibility: hidden;
    }

    .${CARD.editor.fields.accordion.item.class} {
        display: block;
        width: 100%;
        border: 1px solid color-mix(in srgb, var(--card-background-color) 80%, var(--secondary-text-color) 20%);
        border-radius: 6px;
        overflow: visible;
    }
    .${CARD.editor.fields.accordion.icon.class} {
        color: var(--secondary-text-color);
        margin-right: 8px;
    }
    .${CARD.editor.fields.accordion.title.class} {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        position: relative;
        background-color: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        padding: 18px;
        width: 100%;
        height: 48px;
        border: none;
        text-align: left;
        font-size: 15px;
        transition: 0.4s;
    }
    
    .${CARD.editor.fields.accordion.title.class}:focus {
        background-color: var(--secondary-background-color);
    }
    
    .${CARD.editor.fields.accordion.arrow.class} {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-left: auto;
        color: var(--primary-text-color);
        transition: transform 0.2s ease-out;
    }
    .accordion.expanded .${CARD.editor.fields.accordion.arrow.class} {
        transform: rotate(180deg);
    }
    .${CARD.editor.fields.accordion.content.class} {
        display: flex;
        flex-direction: row; /* Pour espacer les éléments verticalement */
        flex-wrap: wrap;
        align-content: flex-start;
        column-gap: 10px;
        row-gap: 20px;
        padding: 0px 18px;
        background-color: transparent;
        max-height: 0;
        transition:
            max-height 0.2s cubic-bezier(0.33, 0, 0.2, 1),
            padding 0.4s cubic-bezier(0.33, 0, 0.2, 1);
        overflow: hidden;
    }

    .accordion.expanded .${CARD.editor.fields.accordion.content.class} {
        max-height: 1000px;
        overflow: visible;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .${CARD.editor.fields.accordion.content.class} > * {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .${CARD.editor.fields.accordion.content.class} > * {
        opacity: 1;
    }
    ha-select {
      --mdc-menu-max-height: 250px; /* Définit la hauteur maximale */
    }
`;

/******************************************************************************************
 *  Debug
 */
function debugLog(message, variable) {
  if (CARD.config.debug) {
    if (variable !== undefined) {
      console.debug(message, variable);
    } else {
      console.debug(message);
    }
  }
}

/**
 * Helper class for managing numeric values.
 * This class validates and stor a numeric value.
 *
 * @class ValueHelper
 */
class ValueHelper {
  #_value = null;
  #_isValid = false;

  constructor(initialValue = null) {
    if (initialValue !== null) {
      this.value = initialValue;
    }
  }

  /******************************************************************************************
   * Getter/Setter
   */
  set value(newValue) {
    this.#_isValid = this.#validate(newValue);
    this.#_value = this.#_isValid ? newValue : null;
  }

  get value() {
    return this.#_value;
  }

  get isValid() {
    return this.#_isValid;
  }

  /******************************************************************************************
   * Validates if a value is a valid float.
   */
  #validate(value) {
    return Number.isFinite(value);
  }
}

/**
 * Represents a non-negative integer value that can be valid or invalid.
 *
 * @class Decimal
 */
class DecimalHelper {
  #value = CARD.config.decimal.percentage;
  #isValid = false;

  /******************************************************************************************
   * Getter/Setter
   */
  set value(newValue) {
    this.#isValid = this.#validate(newValue);
    this.#value = this.#isValid ? newValue : null;
  }

  get value() {
    return this.#value;
  }

  get isValid() {
    return this.#isValid;
  }

  /******************************************************************************************
   * Validates if a value is a valid non-negative integer.
   *
   * @param {number} value - The value to validate.
   * @returns {boolean} True if the value is a valid non-negative integer, false otherwise.
   */
  #validate(value) {
    return typeof value === 'number' && !isNaN(value) && value >= 0 && Number.isInteger(value);
  }
}

/**
 * Represents a unit of measurement, stored as a string.
 *
 * @class Unit
 */
class UnitHelper {
  #value = CARD.config.unit.default;
  #isDisabled = false;

  /******************************************************************************************
   * Getter/Setter
   */
  set value(newValue) {
    this.#value = newValue ?? CARD.config.unit.default;
  }
  get value() {
    return this.#isDisabled ? '' : this.#value;
  }
  set isDisabled(disabled) {
    this.#isDisabled = disabled === true;
  }
  get isDisabled() {
    return this.#isDisabled;
  }
  get isTimerUnit() {
    return this.#value.trim().toLowerCase() === CARD.config.unit.timer;
  }
  get isFlexTimerUnit() {
    return this.#value.trim().toLowerCase() === CARD.config.unit.flexTimer;
  }
  toString() {
    return this.#isDisabled ? '' : this.#value;
  }
}

/**
 * Helper class for calculating and formatting percentages.
 * This class uses `Value`, `Unit`, and `Decimal` objects to manage and validate its internal data.
 *
 * @class PercentHelper
 */
class PercentHelper {
  #hassProvider = null;
  #min = new ValueHelper(CARD.config.value.min);
  #max = new ValueHelper(CARD.config.value.max);
  #current = new ValueHelper(0);
  #unit = new UnitHelper();
  #decimal = new DecimalHelper();
  #percent = 0;
  #isTimer = false;
  #isReversed = false;

  constructor() {
    this.#hassProvider = new HassProvider(this.constructor.name);
  }

  /******************************************************************************************
   * Getter/Setter
   */
  set isTimer(isTimer) {
    this.#isTimer = typeof isTimer === 'boolean' ? isTimer : false;
  }

  set isReversed(isReversed) {
    this.#isReversed = typeof isReversed === 'boolean' ? isReversed : CARD.config.reverse;
  }

  set min(newMin) {
    this.#min.value = Number.isFinite(newMin) ? newMin : CARD.config.value.min;
  }

  set max(newMax) {
    this.#max.value = Number.isFinite(newMax) ? newMax : CARD.config.value.min;
  }

  set current(newCurrent) {
    this.#current.value = newCurrent;
  }

  get actual() {
    return this.#isReversed ? this.#max.value - this.#current.value : this.#current.value;
  }

  get unit() {
    return this.#unit.value;
  }

  set unit(newUnit) {
    this.#unit.value = newUnit;
  }

  set hasDisabledUnit(disabled) {
    this.#unit.isDisabled = disabled;
  }

  set decimal(newDecimal) {
    this.#decimal.value = Number.isFinite(newDecimal) ? newDecimal : CARD.config.decimal.percentage;
  }

  get isValid() {
    return this.#max.value === this.#min.value || !this.#min.isValid || !this.#max.isValid || !this.#current.isValid || !this.#decimal.isValid
      ? false
      : true;
  }

  get range() {
    return this.#max.value - this.#min.value;
  }

  get correctedValue() {
    return this.actual - this.#min.value;
  }

  get percent() {
    if (!this.isValid) {
      return null;
    }
    return this.#percent;
  }

  get hasTimerUnit() {
    return this.#isTimer && this.#unit.isTimerUnit;
  }

  get hasFlexTimerUnit() {
    return this.#isTimer && this.#unit.isFlexTimerUnit;
  }

  get hasTimerOrFlexTimerUnit() {
    return this.hasTimerUnit || this.hasFlexTimerUnit;
  }

  get processedValue() {
    let value = this.actual;

    if (this.#isTimer) {
      value = this.actual / 1000;
    } else if (this.#unit.value === CARD.config.unit.default) {
      value = this.percent;
    }

    return value;
  }

  /******************************************************************************************
   * Calculates the value to display based on the selected theme and unit system.
   *
   * @param {boolean} themeIsLinear - Indicates whether the theme uses a linear scale.
   * @returns {number} - The percentage value if the theme is linear or if the unit is the default,
   *                     otherwise returns the temperature value converted to Celsius if the unit is Fahrenheit.
   *
   * - If the unit is Fahrenheit, the temperature is converted to Celsius before returning.
   * - If the theme is linear or the unit is the default, the percentage value is returned.
   */
  valueForThemes(valueBasedOnPercentage) {
    let value = this.actual;
    if (this.#unit.value === CARD.config.unit.fahrenheit) {
      value = ((value - 32) * 5) / 9;
    }
    return valueBasedOnPercentage || [CARD.config.unit.default, CARD.config.unit.disable].includes(this.#unit.value) ? this.#percent : value;
  }

  /**
   * Calculates and updates the percentage value based on the current, minimum, and maximum values.
   */
  refresh() {
    this.#percent = this.isValid ? +((this.correctedValue / this.range) * 100).toFixed(this.#decimal.value) : 0;
  }
  _getTiming() {
    const seconds = this.actual / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    let s = (seconds % 60).toFixed(this.#decimal.value);

    // Fonction utilitaire pour padStart
    const pad = (value, length = 2) => String(value).padStart(length, '0');

    // Si des décimales existent
    if (s.includes('.')) {
      const [intPart, decimalPart] = s.split('.');
      s = `${pad(intPart)}.${decimalPart}`;
    } else {
      s = pad(s); // Assure que les secondes sont toujours en 2 chiffres
    }

    if (this.hasFlexTimerUnit) {
      if (seconds < 60) {
        return `${parseFloat(s)}s`;
      } else if (seconds < 3600) {
        return `${pad(m)}:${s}`;
      }
    }

    // Formatage final avec heure, minute et seconde
    return [pad(h), pad(m), s].join(':');
  }
  toString() {
    if (!this.isValid) {
      return 'Div0';
    } else if (this.hasTimerOrFlexTimerUnit) {
      // timer with time format
      return this._getTiming();
    }

    let formattedValue;
    const numberFormat = this.#hassProvider.numberFormat;
    if (numberFormat) {
      formattedValue = new Intl.NumberFormat(numberFormat, {
        style: 'decimal',
        minimumFractionDigits: this.#decimal.value,
        maximumFractionDigits: this.#decimal.value,
      }).format(this.processedValue);
    } else {
      formattedValue = `${this.processedValue}`;
    }

    return this.#unit.value ? `${formattedValue}${this.#unit.value}` : formattedValue;
  }
}

/**
 * Manages the theme and its associated icon and color based on a percentage value.
 *
 * @class ThemeManager
 */
class ThemeManager {
  #theme = null;
  #icon = null;
  #color = null;
  #value = 0;
  #isValid = false;
  #isLinear = false;
  #isBasedOnPercentage = false;
  #currentStyle = null;

  /******************************************************************************************
   * Getter/Setter
   */
  set theme(newTheme) {
    if (newTheme === 'battery') {
      newTheme = 'optimal_when_high';
    }
    if (newTheme === 'memory' || newTheme === 'cpu') {
      newTheme = 'optimal_when_low';
    }
    if (!newTheme || !Object.hasOwn(THEME, newTheme)) {
      this.#icon = null;
      this.#color = null;
      this.#theme = null;
      return;
    }
    this.#isValid = true;
    this.#theme = newTheme;
    this.#currentStyle = THEME[newTheme].style;
    this.#isLinear = THEME[newTheme].linear;
    this.#isBasedOnPercentage = THEME[newTheme].percent;
  }

  get theme() {
    return this.#theme;
  }

  set customTheme(newTheme) {
    if (!this.#validateCustomTheme(newTheme)) {
      return;
    }
    this.#theme = CARD.theme.default;
    this.#currentStyle = newTheme;
    this.#isValid = true;
    this.#isLinear = false;
  }

  get isLinear() {
    return this.#isLinear;
  }

  get isBasedOnPercentage() {
    return this.#isBasedOnPercentage;
  }

  get isValid() {
    return this.#isValid;
  }

  set value(newValue) {
    this.#value = newValue;
    this.#refresh();
  }

  get icon() {
    return this.#icon;
  }

  get color() {
    return this.#color;
  }

  /******************************************************************************************
   * Updates the icon and color based on the current theme and percentage.
   * This method calculates the appropriate icon and color from the `THEME` object based on the percentage value.
   *
   * @private
   */
  #refresh() {
    if (!this.#isValid) {
      return;
    }
    if (this.isLinear) {
      this.#setLinearStyle();
    } else {
      this.#setStyle();
    }
  }

  #setLinearStyle() {
    const lastStep = this.#currentStyle.length - 1;
    const thresholdSize = CARD.config.value.max / lastStep;
    const percentage = Math.max(0, Math.min(this.#value, CARD.config.value.max));
    const themeData = this.#currentStyle[Math.floor(percentage / thresholdSize)];
    this.#icon = themeData.icon;
    this.#color = themeData.color;
  }

  #setStyle() {
    let themeData = null;
    if (this.#value >= this.#currentStyle[this.#currentStyle.length - 1].max) {
      themeData = this.#currentStyle[this.#currentStyle.length - 1];
    } else if (this.#value < this.#currentStyle[0].min) {
      themeData = this.#currentStyle[0];
    } else {
      themeData = this.#currentStyle.find((level) => this.#value >= level.min && this.#value < level.max);
    }
    if (themeData) {
      this.#icon = themeData.icon;
      this.#color = themeData.color;
    }
  }

  #validateCustomTheme(customTheme) {
    // array with 1 element
    if (!Array.isArray(customTheme) || customTheme.length === 0) {
      return false;
    }

    // check all elements
    let isFirstItem = true;
    let lastMax = null;

    return customTheme.every((item) => {
      if (item === null || typeof item !== 'object') {
        return false;
      }

      // check keys
      if (!CARD.theme.customTheme.expectedKeys.every((key) => key in item)) {
        return false;
      }

      // min < max
      if (item.min >= item.max) {
        return false;
      }

      // check continuity
      if (!isFirstItem && item.min !== lastMax) {
        return false;
      }

      isFirstItem = false;
      lastMax = item.max;

      return true;
    });
  }
}

/**
 * Provides access to the Home Assistant object.
 * This class implements a singleton pattern to ensure only one instance exists.
 *
 * @class HassProvider
 */
class HassProvider {
  static #instance = null;
  #hass = null;
  #isValid = false;

  constructor(callerName) {
    debugLog(`👉 HassProvider(${callerName})`);
    if (HassProvider.#instance) {
      return HassProvider.#instance;
    }
    HassProvider.#instance = this;
  }

  set hass(hass) {
    if (!hass) {
      return;
    }
    this.#hass = hass;
    this.#isValid = true;
  }
  get isValid() {
    return this.#isValid;
  }
  get hass() {
    return this.#hass;
  }
  get systemLanguage() {
    return this.#isValid && LANGUAGES[this.#hass.config.language] ? this.#hass.config.language : CARD.config.language;
  }
  get language() {
    return this.#isValid && LANGUAGES[this.#hass.language] ? this.#hass.language : CARD.config.language;
  }
  get numberFormat() {
    if (!this.#isValid || !this.#hass?.locale?.number_format) {
      return CARD.config.languageMap[CARD.config.language]; // if unavailable return default
    }
    if (this.#hass?.locale?.number_format === 'none') {
      return null;
    }
    const formatMap = {
      decimal_comma: 'de-DE', // 1.234,56 (Allemagne, France, etc.)
      comma_decimal: 'en-US', // 1,234.56 (USA, UK, etc.)
      space_comma: 'fr-FR', // 1 234,56 (France, Norvège, etc.)
      language: CARD.config.languageMap[this.#hass.language]
        ? CARD.config.languageMap[this.#hass.language]
        : CARD.config.languageMap[CARD.config.language],
      system: Intl.NumberFormat().resolvedOptions().locale,
    };

    return formatMap[this.#hass.locale.number_format] || CARD.config.languageMap[CARD.config.language];
  }
  get hasNewShapeStrategy() {
    if (!this.#hass || !this.#hass.config || !this.#hass.config.version) return false;
    const [year, month] = this.#hass.config.version.split('.').map(Number);
    return year > 2025 || (year === 2025 && month >= 3);
  }
}

/**
 * Helper class for managing entities.
 * This class validates and retrieves information from Home Assistant if it's an entity.
 *
 * @class EntityHelper
 */
class EntityHelper {
  #hassProvider = null;
  #isValid = false;
  #value = {};
  #isAvailable = false;
  #id = null;
  #attribute = null;
  #state = null;
  #domain = null;

  constructor() {
    this.#hassProvider = new HassProvider(this.constructor.name);
  }

  set id(id) {
    this.#id = id;
    this.#isValid = false;
    this.#value = 0;
    if (!(typeof this.#id === 'string' && this.#id)) {
      return;
    }
    this.#validate();
    this.#domain = this.#id.split('.')[0];
  }
  get value() {
    if (this.#isValid) {
      return this.#value;
    } else {
      return null;
    }
  }
  set attribute(newAttribute) {
    this.#attribute = newAttribute;
    this.#isValid = false;
  }
  get state() {
    return this.#state;
  }
  get isValid() {
    return this.#isValid;
  }
  get isAvailable() {
    return this.#isAvailable;
  }
  #validate() {
    if (!this.#hassProvider.hass || !this.#hassProvider.hass.states) {
      return;
    }
    if (!this.#hassProvider.hass.states[this.#id]) {
      this.#state = CARD.config.entity.state.notFound;
      return;
    }
    this.#isValid = true;
  }
  refresh() {
    this.#state = null;
    this.#isAvailable = false;

    this.#validate();
    if (!this.#isValid) {
      return;
    }

    const entityState = this.states;
    this.#state = entityState.state;
    if (this.#state === CARD.config.entity.state.unavailable || this.#state === CARD.config.entity.state.unknown) {
      this.#value = 0;
      return;
    }
    this.#isAvailable = true;

    // timer
    if (this.#domain !== CARD.config.entity.type.timer) {
      this.#manageStdEntity();
    } else {
      this.#manageTimerEntity();
    }
    return;
  }
  #manageStdEntity() {
    if (this.hasAttribute) {
      const attribute = this.#attribute ?? ATTRIBUTE_MAPPING[this.#domain].attribute;
      if (attribute && Object.hasOwn(this.states.attributes, attribute)) {
        this.#value = this.states.attributes[attribute] ?? 0;
        if (this.#domain === ATTRIBUTE_MAPPING.light.label && attribute === ATTRIBUTE_MAPPING.light.attribute) {
          this.#value = (100 * this.#value) / 255;
        }
      } else {
        // attribute not supported
        this.#value = 0;
        this.#isValid = false;
        this.#isAvailable = false;
      }
    } else {
      this.#value = parseFloat(this.#state) || 0;
    }
  }
  #parseDuration(duration) {
    const parts = duration.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;

    return (hours * 3600 + minutes * 60 + seconds) * CARD.config.msFactor;
  }
  #manageTimerEntity() {
    let duration = null;
    let elapsed = null;
    switch (this.#state) {
      case CARD.config.entity.state.idle: {
        elapsed = CARD.config.value.min;
        duration = CARD.config.value.max;
        break;
      }
      case CARD.config.entity.state.active: {
        const finished_at = new Date(this.states.attributes.finishes_at).getTime();
        duration = this.#parseDuration(this.states.attributes.duration);
        const started_at = finished_at - duration;
        const now = new Date().getTime();
        elapsed = now - started_at;
        break;
      }
      case CARD.config.entity.state.paused: {
        const remaining = this.#parseDuration(this.states.attributes.remaining);
        duration = this.#parseDuration(this.states.attributes.duration);
        elapsed = duration - remaining;
        break;
      }
    }
    this.#value = { elapsed: elapsed, duration: duration, state: this.#state };
  }
  #getDeviceClass() {
    const entityState = this.states;

    if (entityState.attributes?.device_class) {
      return entityState.attributes.device_class;
    }
    return null;
  }
  #getIconByDeviceClass() {
    const deviceClass = this.#getDeviceClass();
    const suffix = deviceClass === CARD.config.entity.class.shutter && this.states.attributes.current_position > 0 ? CARD.style.icon.suffix.open : '';
    return deviceClass && Object.hasOwn(CARD.style.icon.byDeviceClass, deviceClass) ? `${CARD.style.icon.byDeviceClass[deviceClass]}${suffix}` : null;
  }
  #getIconByDomain() {
    return this.#domain && Object.hasOwn(CARD.style.icon.byDeviceDomain, this.#domain) ? CARD.style.icon.byDeviceDomain[this.#domain] : null;
  }

  /**
   * Returns the icon of the entity, if valid.
   */
  get icon() {
    return this.#isValid && this.states ? this.states.attributes?.icon || this.#getIconByDeviceClass() || this.#getIconByDomain() : null;
  }
  /******************************************************************************************
   *
   */
  get hasAttribute() {
    return this.#isValid ? !!ATTRIBUTE_MAPPING[this.#domain] : false;
  }
  get defaultAttribute() {
    return this.#isValid && this.hasAttribute ? ATTRIBUTE_MAPPING[this.#domain].attribute : null;
  }
  get name() {
    return this.#isValid ? this.#hassProvider.hass.states[this.#id]?.attributes?.friendly_name : null;
  }
  get states() {
    return this.#isValid ? this.#hassProvider.hass.states[this.#id] : null;
  }
  get unit() {
    return this.#isValid ? this.#hassProvider.hass.states[this.#id]?.attributes?.unit_of_measurement : null;
  }
  get precision() {
    return this.#isValid ? this.#hassProvider?.hass?.entities?.[this.#id]?.display_precision ?? null : null;
  }
  get attributes() {
    return this.#isValid ? this.#hassProvider.hass.states[this.#id]?.attributes ?? null : null;
  }
  get isTimer() {
    return this.#domain === CARD.config.entity.type.timer;
  }
  get hasShapeByDefault() {
    return [CARD.config.entity.type.light, CARD.config.entity.type.fan].includes(this.#domain);
  }

  #getClimateColor() {
    const climateColorMap = {
      heat_cool: CARD.style.color.active,
      dry: CARD.style.color.climate.dry,
      cool: CARD.style.color.climate.cool,
      heat: CARD.style.color.climate.heat,
      fan_only: CARD.style.color.climate.fanOnly,
    };
    return climateColorMap[this.#state] || CARD.style.color.inactive;
  }

  #getBatteryColor() {
    if (!this.#value || this.#value <= 30) {
      return CARD.style.color.battery.low;
    }
    if (this.#value <= 70) {
      return CARD.style.color.battery.medium;
    }
    return CARD.style.color.battery.high;
  }

  get defaultColor() {
    const typeColorMap = {
      [CARD.config.entity.type.timer]:
        this.value && this.value.state === CARD.config.entity.state.active ? CARD.style.color.active : CARD.style.color.inactive,
      [CARD.config.entity.type.cover]: this.value && this.value > 0 ? CARD.style.color.coverActive : CARD.style.color.inactive,
      [CARD.config.entity.type.light]: this.value && this.value > 0 ? CARD.style.color.lightActive : CARD.style.color.inactive,
      [CARD.config.entity.type.fan]: this.value && this.value > 0 ? CARD.style.color.fanActive : CARD.style.color.inactive,
      [CARD.config.entity.type.climate]: this.#getClimateColor(),
      [CARD.config.entity.class.battery]: this.#getBatteryColor(),
    };

    return typeColorMap[this.#domain] ?? typeColorMap[this.#getDeviceClass()] ?? null;
  }
}

/**
 * Represents either an entity ID or a direct value.
 * This class validates the provided value and retrieves information from Home Assistant if it's an entity.
 *
 * @class EntityOrValue
 */
class EntityOrValue {
  #activeHelper = null; // Dynamically set to EntityHelper or ValueHelper
  #isEntity = null;

  #createValueHelper() {
    if (!this.#activeHelper || !(this.#activeHelper instanceof ValueHelper)) {
      this.#activeHelper = new ValueHelper();
      this.#isEntity = false;
    }
  }
  #createEntityHelper() {
    if (!this.#activeHelper || !(this.#activeHelper instanceof EntityHelper)) {
      this.#activeHelper = new EntityHelper();
      this.#isEntity = true;
    }
  }

  /******************************************************************************************
   * Sets the value, which can be an entity ID or a direct value.
   * Dynamically delegates to the appropriate helper.
   * @param {string|number} input - The value or entity ID.
   */
  set value(input) {
    if (typeof input === 'string') {
      this.#createEntityHelper();
      this.#activeHelper.id = input;
    } else if (Number.isFinite(input)) {
      this.#createValueHelper();
      this.#activeHelper.value = input;
    } else {
      this.#activeHelper = null;
    }
  }

  /******************************************************************************************
   * Proxy function
   */
  get isEntity() {
    return this.#isEntity;
  }
  get value() {
    return this.#activeHelper ? this.#activeHelper.value : null;
  }
  set attribute(newAttribute) {
    if (this.#isEntity) {
      this.#activeHelper.attribute = newAttribute;
    }
  }
  get state() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.state : null;
  }
  get isValid() {
    return this.#activeHelper ? this.#activeHelper.isValid : false;
  }
  get isAvailable() {
    return this.#activeHelper ? (this.#isEntity && this.#activeHelper.isAvailable) || this.#activeHelper.isValid : false;
  }
  get precision() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.precision : null;
  }
  get name() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.name : null;
  }
  get icon() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.icon : null;
  }
  get isTimer() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.isTimer : false;
  }
  get hasShapeByDefault() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.hasShapeByDefault : false;
  }
  get defaultColor() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.defaultColor : false;
  }
  get hasAttribute() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.hasAttribute : false;
  }
  get defaultAttribute() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.defaultAttribute : null;
  }
  get attributes() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.attributes : null;
  }
  get unit() {
    return this.#activeHelper && this.#isEntity ? this.#activeHelper.unit : null;
  }
  refresh() {
    if (this.#activeHelper && this.#isEntity) {
      this.#activeHelper.refresh();
    }
  }
}

/**
 * Helper class for managing and validating card configuration.
 *
 * @class ConfigHelper
 */
class ConfigHelper {
  #config = {};
  #bar = { size: null, color: null, orientation: null, changed: null };
  #isValid = false;
  #msg = null;
  #isChanged = false;
  #hassProvider = null;

  constructor() {
    this.#hassProvider = new HassProvider(this.constructor.name);
  }

  /******************************************************************************************
   * Getter/Setter
   */
  get config() {
    return this.#config;
  }

  set config(config) {
    this.#isChanged = true;
    this.#config = config;
    this.#bar.size =
      this.#config.bar_size && Object.hasOwn(CARD.style.bar.sizeOptions, this.#config.bar_size)
        ? this.#config.bar_size
        : CARD.style.bar.sizeOptions.small.label;
    this.#bar.color = this.#config.bar_color;
    this.#bar.orientation = Object.hasOwn(CARD.style.dynamic.progressBar.orientation, this.#config.bar_orientation)
      ? CARD.style.dynamic.progressBar.orientation[this.#config.bar_orientation]
      : null;
    this.#bar.changed =
      typeof this.#config.bar_orientation === 'string' &&
      Object.keys(CARD.style.dynamic.progressBar.orientation).includes(this.#config.bar_orientation);
  }

  get decimal() {
    if (this.#config.decimal === undefined) {
      if (this.unit === CARD.config.unit.default) {
        return CARD.config.decimal.percentage;
      } else {
        return CARD.config.decimal.other;
      }
    }
    if (Number.isInteger(this.#config.decimal) && this.#config.decimal >= 0) {
      return this.#config.decimal;
    }
    return null;
  }

  get isValid() {
    return this.#isValid;
  }

  get msg() {
    return this.#msg;
  }

  get color() {
    return this.#config.color;
  }
  get layout() {
    return Object.hasOwn(CARD.layout.orientations, this.#config.layout)
      ? CARD.layout.orientations[this.#config.layout].label
      : CARD.layout.orientations.horizontal.label;
  }
  get bar() {
    return this.#bar;
  }
  get icon() {
    return this.#config.icon;
  }
  get entity() {
    return this.#config.entity;
  }
  get name() {
    return this.#config.name;
  }
  get force_circular_background() {
    return this.#config.force_circular_background === undefined || this.#config.force_circular_background === false ? false : true;
  }
  get min_value() {
    return this.#config.min_value ? this.#config.min_value : CARD.config.value.min;
  }
  get max_value() {
    if (!this.#config.max_value) {
      return CARD.config.value.max;
    }
    if (Number.isFinite(this.#config.max_value)) {
      return this.#config.max_value;
    }
    if (typeof this.#config.max_value === 'string') {
      const state = this.#hassProvider.hass.states[this.#config.max_value]?.state;
      const parsedState = parseFloat(state);

      if (!isNaN(parsedState)) {
        return parsedState;
      }
    }
    return null;
  }
  get unit() {
    return this.#config.unit ? this.#config.unit : CARD.config.unit.default;
  }
  get hasDisabledUnit() {
    return this.#config.disable_unit;
  }
  get urlPath() {
    return this.cardTapAction === CARD.interactions.action.url.action && this.#config.tap_action.url_path !== undefined
      ? this.#config.tap_action.url_path
      : null;
  }
  get navigationPath() {
    return this.cardTapAction === CARD.interactions.action.navigate.action && this.#config.tap_action.navigation_path !== undefined
      ? this.#config.tap_action.navigation_path
      : null;
  }
  get navigate_to() {
    return this.urlPath || this.navigationPath;
  }
  get cardTapAction() {
    const result = (this.#config.tap_action?.action ?? null) === null ? CARD.interactions.action.default : this.#config.tap_action?.action;
    return result;
  }
  get cardHoldAction() {
    const result = (this.#config.hold_action?.action ?? null) === null ? CARD.interactions.action.default : this.#config.tap_action?.action;
    return result;
  }
  get iconTapAction() {
    const result = (this.#config.icon_tap_action?.action ?? null) === null ? CARD.interactions.action.default : this.#config.icon_tap_action?.action;
    return result;
  }
  get theme() {
    return this.#config.theme;
  }
  get custom_theme() {
    return this.#config.custom_theme;
  }
  get reverse() {
    return this.#config.reverse;
  }

  /******************************************************************************************
   * Validates the card configuration and returns the validation status and error messages.
   */
  checkConfig() {
    if (!this.#isChanged) {
      return;
    }
    this.#isChanged = false;
    this.#isValid = false;
    const entityState = this.#hassProvider.hass.states[this.#config.entity];
    const maxValueState =
      typeof this.#config.max_value === 'string' && this.#config.max_value.trim() ? this.#hassProvider.hass.states[this.#config.max_value] : null;
    const validationRules = [
      {
        valid: !!this.#config.entity,
        msg: LANGUAGES[this.#hassProvider.language].card.msg.entityError,
      },
      {
        valid: !this.#config.attribute || (entityState && Object.hasOwn(entityState.attributes, this.#config.attribute)),
        msg: LANGUAGES[this.#hassProvider.language].card.msg.attributeNotFound,
      },
      {
        valid: Number.isFinite(this.min_value),
        msg: LANGUAGES[this.#hassProvider.language].card.msg.minValueError,
      },
      {
        valid:
          Number.isFinite(this.max_value) ||
          (maxValueState && (this.#config.max_value_attribute ? Object.hasOwn(maxValueState.attributes, this.#config.max_value_attribute) : true)),
        msg: LANGUAGES[this.#hassProvider.language].card.msg.maxValueError,
      },
      {
        valid: Number.isFinite(this.decimal),
        msg: LANGUAGES[this.#hassProvider.language].card.msg.decimalError,
      },
    ];

    for (const rule of validationRules) {
      if (!rule.valid) {
        this.#msg = rule.msg;
        return;
      }
    }
    this.#isValid = true;
    this.#msg = null;

    return;
  }
}

/**
 * A card view that manage all informations to create the card.
 *
 * @class CardView
 */
class CardView {
  #hassProvider = null;
  #configHelper = new ConfigHelper();
  #percentHelper = new PercentHelper();
  #theme = new ThemeManager();
  #currentValue = new EntityOrValue();
  #max_value = new EntityOrValue();
  #currentLanguage = CARD.config.language;
  #isReversed = false;

  constructor() {
    this.#hassProvider = new HassProvider(this.constructor.name);
  }

  /******************************************************************************************
   * Getter/Setter
   */
  get hasValidatedConfig() {
    return this.#configHelper.isValid;
  }

  get msg() {
    return this.#configHelper.msg;
  }

  get config() {
    return this.#configHelper.config;
  }

  get isUnknown() {
    return this.#currentValue.state === CARD.config.entity.state.unknown || this.#max_value.state === CARD.config.entity.state.unknown;
  }

  get isUnavailable() {
    return this.#currentValue.state === CARD.config.entity.state.unavailable || this.#max_value.state === CARD.config.entity.state.unavailable;
  }

  get isNotFound() {
    return this.#currentValue.state === CARD.config.entity.state.notFound || this.#max_value.state === CARD.config.entity.state.notFound;
  }

  get isAvailable() {
    return !(!this.#currentValue.isAvailable || (!this.#max_value.isAvailable && this.#configHelper.max_value));
  }

  set currentLanguage(newLanguage) {
    if (Object.keys(LANGUAGES).includes(newLanguage)) {
      this.#currentLanguage = newLanguage;
    }
  }

  get currentLanguage() {
    return this.#currentLanguage;
  }

  get entity() {
    return this.#configHelper.entity;
  }

  get icon() {
    if (this.isNotFound) {
      return CARD.style.icon.notFound.icon;
    }
    if (this.#theme.theme === CARD.theme.battery.label && this.#currentValue.icon && this.#currentValue.icon.includes(CARD.theme.battery.icon)) {
      return this.#currentValue.icon;
    }
    return this.#theme.icon || this.#configHelper.icon || this.#currentValue.icon || CARD.style.icon.default.icon;
  }

  get color() {
    if (this.isUnavailable) {
      return CARD.style.color.unavailable;
    }
    if (this.isNotFound) {
      return CARD.style.color.notFound;
    }
    return this.#theme.color || this.#convertColorFromConfig(this.#configHelper.color) || this.#currentValue.defaultColor || CARD.style.color.default;
  }

  get bar_color() {
    if (this.isAvailable) {
      return (
        this.#theme.color || this.#convertColorFromConfig(this.#configHelper.bar.color) || this.#currentValue.defaultColor || CARD.style.color.default
      );
    }
    if (this.isUnknown) {
      return CARD.style.color.default;
    }
    return CARD.style.color.disabled;
  }

  get percent() {
    if (this.isAvailable) {
      return Math.min(CARD.config.value.max, Math.max(0, this.#percentHelper.percent));
    }
    return CARD.config.value.min;
  }

  get description() {
    if (this.isNotFound) {
      return LANGUAGES[this.#hassProvider.language].card.msg.entityNotFound;
    }
    if (this.isUnknown) {
      return LANGUAGES[this.#hassProvider.language].card.msg.entityUnknown;
    }
    if (this.isUnavailable) {
      return LANGUAGES[this.#hassProvider.language].card.msg.entityUnavailable;
    }
    return this.#percentHelper.toString();
  }

  get name() {
    return this.#configHelper.name || this.#currentValue.name || this.#configHelper.entity;
  }

  get hasStandardEntityError() {
    if (this.isUnavailable || this.isNotFound || this.isUnknown) {
      return true;
    }
    return false;
  }

  get isBadgeEnable() {
    if (
      !(
        this.isUnavailable ||
        this.isNotFound ||
        (this.#currentValue.isTimer &&
          (this.#currentValue.value.state === CARD.config.entity.state.paused || this.#currentValue.value.state === CARD.config.entity.state.active))
      )
    ) {
      return false;
    }
    return true;
  }

  get badgeInfo() {
    if (this.isNotFound) {
      return CARD.style.icon.badge.notFound;
    }
    if (this.isUnavailable) {
      return CARD.style.icon.badge.unavailable;
    }
    if (this.#currentValue.isTimer) {
      const { state } = this.#currentValue.value;
      const { paused, active } = CARD.config.entity.state;
      if (state === paused) return CARD.style.icon.badge.timer.paused;
      if (state === active) return CARD.style.icon.badge.timer.active;
    }
    return null;
  }
  get layout() {
    return this.#configHelper.layout;
  }
  get isActiveTimer() {
    return this.#currentValue.isTimer && this.#currentValue.state === CARD.config.entity.state.active;
  }
  get refreshSpeed() {
    const rawSpeed = this.#currentValue.value.duration / CARD.config.refresh.ratio;
    const clampedSpeed = Math.min(CARD.config.refresh.max, Math.max(CARD.config.refresh.min, rawSpeed));
    const roundedSpeed = Math.max(100, Math.round(clampedSpeed / 100) * 100);
    debugLog(roundedSpeed);

    return roundedSpeed;
  }
  get show_more_info() {
    return [CARD.interactions.action.default, CARD.interactions.action.moreInfo.action].includes(this.#configHelper.cardTapAction);
  }
  get navigate_to() {
    return this.#configHelper.navigate_to;
  }
  get bar() {
    return this.#configHelper.bar;
  }
  get hasClickableIcon() {
    return this.#configHelper.iconTapAction !== CARD.interactions.action.none.action;
  }
  get hasClickableCard() {
    return (
      this.#configHelper.cardTapAction !== CARD.interactions.action.none.action ||
      this.#configHelper.cardHoldAction !== CARD.interactions.action.none.action
    );
  }

  get isClickable() {
    return this.#configHelper.cardTapAction !== CARD.interactions.action.none.action;
  }
  get hasVisibleShape() {
    return this.#hassProvider.hasNewShapeStrategy
      ? this.#configHelper.force_circular_background ||
          (this.#currentValue.hasShapeByDefault && this.#configHelper.iconTapAction !== CARD.interactions.action.none.action) ||
          [
            CARD.interactions.action.navigate.action,
            CARD.interactions.action.url.action,
            CARD.interactions.action.moreInfo.action,
            CARD.interactions.action.assist.action,
            CARD.interactions.action.toggle.action,
            CARD.interactions.action.performAction.action,
          ].includes(this.#configHelper.iconTapAction)
      : true;
  }
  get hasHiddenIcon() {
    return this.#isComponentConfiguredAsHidden(CARD.style.dynamic.hiddenComponent.icon.label);
  }
  get hasHiddenName() {
    return this.#isComponentConfiguredAsHidden(CARD.style.dynamic.hiddenComponent.name.label);
  }
  get hasHiddenSecondaryInfo() {
    return this.#isComponentConfiguredAsHidden(CARD.style.dynamic.hiddenComponent.secondary_info.label);
  }
  get hasHiddenProgressBar() {
    return this.#isComponentConfiguredAsHidden(CARD.style.dynamic.hiddenComponent.progress_bar.label);
  }

  /******************************************************************************************
   * Sets the card configuration and updates related properties.
   *
   * @param {object} config - The new card configuration.
   */
  set config(config) {
    this.#configHelper.config = config;
    this.#percentHelper.unit = this.#configHelper.unit;
    this.#percentHelper.hasDisabledUnit = this.#configHelper.hasDisabledUnit;
    this.#theme.theme = this.#configHelper.theme;
    this.#theme.customTheme = this.#configHelper.custom_theme;
    this.#currentValue.value = this.#configHelper.entity;
    this.#percentHelper.isTimer = this.#currentValue.isTimer;
    if (this.#currentValue.isTimer) {
      this.#isReversed = this.#configHelper.reverse;
      this.#max_value.value = CARD.config.value.max;
    } else {
      this.#currentValue.attribute = config.attribute || null;
      this.#max_value.value = config.max_value ?? CARD.config.value.max;
      this.#max_value.attribute = config.max_value_attribute || null;
    }
  }

  /**
   * Refreshes the card by updating the current value and checking for availability.
   *
   * @param {object} hass - The Home Assistant object.
   */
  refresh(hass) {
    this.#hassProvider.hass = hass;
    this.currentLanguage = this.#hassProvider.language;
    this.#currentValue.refresh();
    this.#max_value.refresh();
    this.#configHelper.checkConfig();

    if (!this.isAvailable) {
      return;
    }

    // update
    this.#percentHelper.decimal = this.#getCurrentDecimal();

    if (this.#currentValue.isTimer) {
      this.#percentHelper.isReversed =
        typeof this.#isReversed === 'boolean' && this.#isReversed && this.#currentValue.value.state !== CARD.config.entity.state.idle;
      this.#percentHelper.current = this.#currentValue.value.elapsed;
      this.#percentHelper.min = CARD.config.value.min;
      this.#percentHelper.max = this.#currentValue.value.duration;
    } else {
      this.#percentHelper.current = this.#currentValue.value;
      this.#percentHelper.min = this.#configHelper.min_value;
      this.#percentHelper.max = this.#max_value.value;
    }
    this.#percentHelper.refresh();
    this.#theme.value = this.#percentHelper.valueForThemes(this.#theme.isBasedOnPercentage);
  }

  #isComponentConfiguredAsHidden(component) {
    return Array.isArray(this.#configHelper.config?.hide) && this.#configHelper.config.hide.includes(component);
  }

  #getCurrentDecimal() {
    if (this.#configHelper.config.decimal !== undefined) return this.#configHelper.config.decimal;
    if (this.#currentValue.precision) return this.#currentValue.precision;
    if (this.#currentValue.isTimer) return CARD.config.decimal.timer;
    if (this.#configHelper.unit === CARD.config.unit.default) return CARD.config.decimal.percentage;

    return CARD.config.decimal.other;
  }
  #convertColorFromConfig(curColor) {
    if (curColor == null) return null;
    return DEF_COLORS.includes(curColor) ? `var(--${curColor}-color)` : curColor;
  }
}

/** --------------------------------------------------------------------------
 *
 * Represents a custom card element displaying the progress of an entity.
 *
 * The `EntityProgressCard` class extends the base `HTMLElement` class and
 * implements a custom web component that displays information about an entity's
 * state.
 */
class EntityProgressCard extends HTMLElement {
  #cardView = new CardView();
  #elements = {};
  #errorVisible = false;
  #lastHass = null;
  #autoRefreshInterval = null;

  #holdTimeout = null;
  #downTime = null;
  #isHolding = null;
  #clickSource = null;
  #startX = 0;
  #startY = 0;
  #clickableTarget = null;
  #boundHandlers = {
    mousedown: (e) => this.#handleMouseDown(e),
    mouseup: (e) => this.#handleMouseUp(e),
    mousemove: (e) => this.#handleMouseMove(e),
    touchstart: (e) => this.#handleMouseDown(e),
    touchend: (e) => this.#handleMouseUp(e),
    touchmove: (e) => this.#handleMouseMove(e),
  };

  constructor() {
    super();
    this.attachShadow({ mode: CARD.config.shadowMode });

    if (!EntityProgressCard._moduleLoaded) {
      console.groupCollapsed(CARD.console.message, CARD.console.css);
      console.log(CARD.console.link);
      console.groupEnd();
      debugLog(Object.keys(LANGUAGES));
      EntityProgressCard._moduleLoaded = true;
    }
    // this.addEventListener(CARD.interactions.event.click, this.#fireAction);
  }

  connectedCallback() {
    debugLog('👉 connectedCallback()');

    this.#clickableTarget = this.#cardView.hasClickableCard
      ? this
      : this.#cardView.hasClickableIcon
        ? this.#elements[CARD.htmlStructure.elements.icon.class]
        : null;

    if (this.#clickableTarget) {
      this.#attachListener(this.#clickableTarget);
    }
  }
  #attachListener(elem) {
    debugLog('👉 #attachListener()');
    elem.addEventListener('mousedown', this.#boundHandlers.mousedown);
    elem.addEventListener('mouseup', this.#boundHandlers.mouseup);
    elem.addEventListener('mousemove', this.#boundHandlers.mousemove);
    elem.addEventListener('touchstart', this.#boundHandlers.touchstart, { passive: true });
    elem.addEventListener('touchend', this.#boundHandlers.touchend);
    elem.addEventListener('touchmove', this.#boundHandlers.touchmove, { passive: true });
  }

  disconnectedCallback() {
    debugLog('👉 disconnectedCallback()');
    if (this.#clickableTarget) {
      this.#detachListener(this.#clickableTarget);
    }
  }

  #detachListener(elem) {
    debugLog('👉 #detachListener()');
    elem.removeEventListener('mousedown', this.#boundHandlers.mousedown);
    elem.removeEventListener('mouseup', this.#boundHandlers.mouseup);
    elem.removeEventListener('mousemove', this.#boundHandlers.mousemove);
    elem.removeEventListener('touchstart', this.#boundHandlers.touchstart);
    elem.removeEventListener('touchend', this.#boundHandlers.touchend);
    elem.removeEventListener('touchmove', this.#boundHandlers.touchmove);
    clearTimeout(this.#holdTimeout);
  }

  #handleMouseDown(ev) {
    debugLog('👉 handleMouseDown()');
    debugLog('    ', ev.originalTarget.localName);

    this.#clickSource = CARD.interactions.event.originalTarget.icon.includes(ev.originalTarget.localName)
      ? CARD.interactions.event.from.icon
      : CARD.interactions.event.from.card;

    this.#downTime = Date.now();
    this.#startX = ev.clientX;
    this.#startY = ev.clientY;
    this.#isHolding = false;

    this.#holdTimeout = setTimeout(() => {
      this.#isHolding = true; // Marquer comme un "hold" potentiel si le délai est atteint
    }, 500); // Seuil de 500ms pour considérer comme un hold
  }

  #handleMouseUp(ev) {
    clearTimeout(this.#holdTimeout);
    const upTime = Date.now();
    const deltaTime = upTime - this.#downTime;

    if (this.#isHolding) {
      this.#fireAction(ev, 'hold'); // Déclencher l'action de "hold" au relâchement après le délai
    } else if (deltaTime < 500 && Math.abs(ev.clientX - this.#startX) < 5 && Math.abs(ev.clientY - this.#startY) < 5) {
      this.#fireAction(ev, 'tap'); // Gérer l'action du simple clic (tap)
    }
    this.#downTime = null;
    this.#clickSource = null;
    this.#isHolding = false; // Réinitialiser l'état
  }

  #handleMouseMove(ev) {
    // Si la souris bouge de plus de 5 pixels pendant le maintien, annuler le timeout du hold potentiel
    if (this.#downTime && (Math.abs(ev.clientX - this.#startX) > 5 || Math.abs(ev.clientY - this.#startY) > 5)) {
      clearTimeout(this.#holdTimeout);
      this.#isHolding = false;
      this.#downTime = null;
    }
  }

  #fireAction(originalEvent, action = 'tap') {
    debugLog('👉 EntityProgressCard.#fireAction()');
    debugLog('  📎 originalEvent: ', originalEvent);
    action = this.#clickSource === CARD.interactions.event.from.icon ? 'icon_tap' : action;
    debugLog('  📎 action: ', action);

    this.dispatchEvent(
      new CustomEvent('hass-action', {
        bubbles: true,
        composed: true,
        detail: {
          config: this.#cardView.config,
          action: action,
          originalEvent,
        },
      })
    );
  }

  /**
   * Creates and returns a new configuration element for the component.
   *
   * @returns {HTMLElement} A newly created configuration element.
   */
  static getConfigElement() {
    return document.createElement(CARD.meta.editor);
  }

  /**
   * Updates the component's configuration and triggers static changes.
   */
  setConfig(config) {
    this.#cardView.config = config;
    this.#buildCard();
  }

  /**
   * Sets the Home Assistant (`hass`) instance and updates dynamic elements.
   *
   * @param {Object} hass - The Home Assistant instance containing the current
   *                        state and services.
   */
  set hass(hass) {
    // On garde toujours la dernière valeur de hass
    this.#lastHass = hass;

    // Si ce n'est pas un timer actif, on fait un rafraîchissement immédiat
    if (!this.#cardView.isActiveTimer) {
      this.refresh(hass);
      this.#stopAutoRefresh();
      return;
    }
    if (!this.#autoRefreshInterval) {
      this.refresh(hass);
      this.#startAutoRefresh();
    }
  }

  refresh(hass) {
    this.#cardView.refresh(hass);
    this.#updateDynamicElements();
  }

  #startAutoRefresh() {
    this.#autoRefreshInterval = setInterval(() => {
      this.refresh(this.#lastHass);
      debugLog('👉 EntityProgressCard.#startAutoRefresh()');
      if (!this.#cardView.isActiveTimer) {
        this.#stopAutoRefresh();
        return;
      }
    }, this.#cardView.refreshSpeed);
  }

  #stopAutoRefresh() {
    if (this.#autoRefreshInterval) {
      clearInterval(this.#autoRefreshInterval);
      this.#autoRefreshInterval = null;
    }
  }

  /**
   * Builds and initializes the structure of the custom card component.
   *
   * This method creates the visual and structural elements of the card and injects
   * them into the component's Shadow DOM.
   */
  #buildCard() {
    const card = document.createElement(CARD.htmlStructure.card.element);
    card.classList.add(CARD.meta.typeName);
    card.classList.toggle(CARD.style.dynamic.clickable.card, this.#cardView.hasClickableCard);
    card.classList.toggle(CARD.style.dynamic.clickable.icon, this.#cardView.hasClickableIcon);
    card.classList.toggle(this.#cardView.bar.orientation, this.#cardView.bar.changed);
    card.classList.add(this.#cardView.layout);
    card.classList.add(this.#cardView.bar.size);
    card.classList.toggle(CARD.style.dynamic.secondaryInfoError.class, this.#cardView.hasStandardEntityError);
    card.classList.toggle(CARD.style.dynamic.hiddenComponent.icon.class, this.#cardView.hasHiddenIcon);
    card.classList.toggle(CARD.style.dynamic.hiddenComponent.name.class, this.#cardView.hasHiddenName);
    card.classList.toggle(CARD.style.dynamic.hiddenComponent.secondary_info.class, this.#cardView.hasHiddenSecondaryInfo);
    card.classList.toggle(CARD.style.dynamic.hiddenComponent.progress_bar.class, this.#cardView.hasHiddenProgressBar);

    card.innerHTML = CARD_HTML;
    const style = document.createElement(CARD.style.element);
    style.textContent = CARD_CSS;

    // Inject in the DOM
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
    // store DOM ref to update
    this.#elements = {
      [CARD.htmlStructure.card.element]: card,
      [CARD.htmlStructure.elements.icon.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.elements.icon.class}`),
      [CARD.htmlStructure.elements.shape.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.elements.shape.class}`),
      [CARD.htmlStructure.elements.badge.icon.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.elements.badge.icon.class}`),
      [CARD.htmlStructure.elements.name.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.elements.name.class}`),
      [CARD.htmlStructure.elements.percentage.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.elements.percentage.class}`),
      [CARD.htmlStructure.alert.container.element]: this.shadowRoot.querySelector(`${CARD.htmlStructure.alert.container.element}`),
      [CARD.htmlStructure.alert.icon.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.alert.icon.class}`),
      [CARD.htmlStructure.alert.message.class]: this.shadowRoot.querySelector(`.${CARD.htmlStructure.alert.message.class}`),
    };
  }

  /**
   * Updates the specified DOM element based on a provided callback function.
   */
  #updateElement(key, updateCallback) {
    const element = this.#elements[key];
    if (element) {
      updateCallback(element);
    }
  }

  #manageErrorMessage() {
    if (!this.#cardView.hasValidatedConfig) {
      this.#showError(this.#cardView.msg);
      this.#errorVisible = true;
      return;
    } else if (this.#errorVisible) {
      this.#hideError();
      this.#errorVisible = false;
    }
  }

  #updateCSS() {
    this.#updateElement(CARD.htmlStructure.card.element, (el) => {
      el.style.setProperty(CARD.style.dynamic.progressBar.color.var, this.#cardView.bar_color);
      el.style.setProperty(CARD.style.dynamic.progressBar.size.var, `${this.#cardView.percent}%`);
      el.style.setProperty(CARD.style.dynamic.iconAndShape.color.var, this.#cardView.color);
    });
  }

  /**
   * Updates dynamic card elements based on the entity's state and configuration.
   */
  #updateDynamicElements() {
    this.#manageErrorMessage();
    this.#showBadge();
    this.#manageShape();
    this.#updateCSS();

    this.#updateElement(CARD.htmlStructure.elements.icon.class, (el) => {
      if (el.getAttribute(CARD.htmlStructure.elements.icon.class) !== this.#cardView.icon) {
        el.setAttribute(CARD.htmlStructure.elements.icon.class, this.#cardView.icon);
      }
    });

    this.#updateElement(CARD.htmlStructure.elements.name.class, (el) => {
      if (el.textContent !== this.#cardView.name) {
        el.textContent = this.#cardView.name;
      }
    });

    this.#updateElement(CARD.htmlStructure.elements.percentage.class, (el) => {
      if (el.textContent !== this.#cardView.description) {
        el.textContent = this.#cardView.description;
      }
    });
  }

  #manageShape() {
    this.#elements[CARD.htmlStructure.card.element].classList.toggle(CARD.style.dynamic.hiddenComponent.shape.class, !this.#cardView.hasVisibleShape);
  }

  /**
   * Displays a badge
   */
  #showBadge() {
    const isBadgeEnable = this.#cardView.isBadgeEnable;
    this.#elements[CARD.htmlStructure.card.element].classList.toggle(
      `${CARD.style.dynamic.show}-${CARD.htmlStructure.elements.badge.container.class}`,
      isBadgeEnable
    );
    if (isBadgeEnable) {
      const badgeInfo = this.#cardView.badgeInfo;
      if (!badgeInfo) {
        return;
      }
      this.#updateElement(CARD.htmlStructure.elements.badge.icon.class, (el) => {
        if (el.getAttribute(badgeInfo.attribute) !== badgeInfo.icon) {
          el.setAttribute(badgeInfo.attribute, badgeInfo.icon);
        }
      });
      this.#updateElement(CARD.htmlStructure.card.element, (el) => {
        el.style.setProperty(CARD.style.dynamic.badge.backgroundColor.var, badgeInfo.backgroundColor);
        el.style.setProperty(CARD.style.dynamic.badge.color.var, badgeInfo.color);
      });
    }
  }

  /**
   * Displays an error alert with the provided message.
   *
   * @param {string} message - The error message to display in the alert.
   */
  #showError(message) {
    this.#elements[CARD.htmlStructure.card.element].classList.toggle(
      `${CARD.style.dynamic.show}-${CARD.htmlStructure.alert.container.element}`,
      true
    );
    this.#updateElement(CARD.htmlStructure.alert.icon.class, (el) => {
      if (el.getAttribute(CARD.style.icon.alert.attribute) !== CARD.style.icon.alert.icon) {
        el.setAttribute(CARD.style.icon.alert.attribute, CARD.style.icon.alert.icon);
      }
    });
    this.#updateElement(CARD.htmlStructure.alert.message.class, (el) => {
      if (el.textContent !== message) {
        el.textContent = message;
      }
    });
  }

  /**
   * Hides the error alert by setting its display style to hide.
   *
   * @returns {void}
   */
  #hideError() {
    this.#elements[CARD.htmlStructure.card.element].classList.toggle(
      `${CARD.style.dynamic.show}-${CARD.htmlStructure.alert.container.element}`,
      false
    );
  }

  /**
   * Returns the number of grid rows for the card size based on the current layout.
   *
   * @returns {number} - The number of grid rows for the current card layout.
   */
  getCardSize() {
    if (this.#cardView.layout === CARD.layout.orientations.vertical.label) {
      return CARD.layout.orientations.vertical.grid.grid_rows;
    }
    return CARD.layout.orientations.horizontal.grid.grid_rows;
  }

  /**
   * Returns the layout options based on the current layout configuration.
   *
   * @returns {object} - The layout options for the current layout configuration.
   */
  getLayoutOptions() {
    if (this.#cardView.layout === CARD.layout.orientations.vertical.label) {
      return CARD.layout.orientations.vertical.grid;
    }
    return CARD.layout.orientations.horizontal.grid;
  }
}

/** --------------------------------------------------------------------------
 * Define static properties and register the custom element for the card.
 *
 * @static
 */
EntityProgressCard.version = VERSION;
EntityProgressCard._moduleLoaded = false;
customElements.define(CARD.meta.typeName, EntityProgressCard);

/** --------------------------------------------------------------------------
 * Registers the custom card in the global `customCards` array for use in Home Assistant.
 */
window.customCards = window.customCards || []; // Create the list if it doesn't exist. Careful not to overwrite it
window.customCards.push({
  type: CARD.meta.typeName,
  name: CARD.meta.name,
  description: CARD.meta.description,
});

/** --------------------------------------------------------------------------
 * Custom editor component for configuring the `EntityProgressCard`.
 * HA Components:
 *  - https://github.com/home-assistant/frontend/blob/28304bb1dcebfddf3ab991e2f9e38f44427fe0f8/src/data/selector.ts
 */
class EntityProgressCardEditor extends HTMLElement {
  #hassProvider = null;
  #container = null;
  #config = {};
  #previous = { entity: null, max_value: null };
  #isRendered = false;
  #elements = {};
  #accordionContent = [];
  #currentLanguage = CARD.config.language;

  constructor() {
    super();
    this.attachShadow({ mode: CARD.config.shadowMode });
    this.#hassProvider = new HassProvider(this.constructor.name);
  }

  set hass(hass) {
    if (!hass) {
      return;
    }
    if (!this.#hassProvider.hass || this.#hassProvider.hass.entities !== hass.entities) {
      this.#hassProvider.hass = hass;
    }
    this.#currentLanguage = this.#hassProvider.language;
  }

  setConfig(config) {
    debugLog('👉 editor.setConfig()');
    debugLog('  📎 ', config);
    this.#config = config;
    if (!this.#hassProvider.isValid) {
      return;
    }
    if (!this.#isRendered) {
      this.render();
      this.#addEventListener();
      this.#isRendered = true;
    }
    this.#updateFields();
  }

  #updateFields() {
    debugLog('👉 editor.#updateFields()');
    const keys = Object.keys(this.#elements);
    keys.forEach((key) => {
      if (
        ![
          CARD.editor.fields.tap_action.type,
          CARD.editor.fields.hold_action.type,
          CARD.editor.fields.icon_tap_action.type,
          CARD.editor.keyMappings.attribute,
          CARD.editor.keyMappings.max_value_attribute,
          EDITOR_INPUT_FIELDS.theme.field.icon.name,
          EDITOR_INPUT_FIELDS.theme.field.color.name,
          EDITOR_INPUT_FIELDS.theme.field.bar_color.name,
          EDITOR_INPUT_FIELDS.basicConfiguration.entity.name,
        ].includes(key) &&
        Object.hasOwn(this.#config, key) &&
        this.#elements[key].value !== this.#config[key]
      ) {
        this.#elements[key].value = this.#config[key];
        debugLog('✅ updateFields - update: ', [key, this.#config[key]]);
      }
    });

    const updateHAFormTypes = [
      CARD.editor.fields.entity.type,
      CARD.editor.fields.tap_action.type,
      CARD.editor.fields.hold_action.type,
      CARD.editor.fields.icon_tap_action.type,
      CARD.editor.fields.icon.type,
      EDITOR_INPUT_FIELDS.theme.field.bar_color.name,
      EDITOR_INPUT_FIELDS.theme.field.color.name,
    ];

    for (const updateHAFormType of updateHAFormTypes) {
      this.#updateHAForm(this.#elements[updateHAFormType], updateHAFormType, this.#config[updateHAFormType]);
    }

    // Theme
    this.#toggleFieldDisable(CARD.editor.keyMappings.theme, !!this.#config.theme);

    const entityHasAttribute = this.#updateAttributFromEntity('entity', 'attribute');
    this.#toggleFieldDisable(EDITOR_INPUT_FIELDS.basicConfiguration.attribute.isInGroup, !entityHasAttribute);

    const maxVlueHasAttribute = this.#updateAttributFromEntity('max_value', 'max_value_attribute');
    this.#toggleFieldDisable(EDITOR_INPUT_FIELDS.content.field.max_value_attribute.isInGroup, !maxVlueHasAttribute);

    // hide
    this.#updateToggleFields();
  }

  #updateHAForm(form, key, newValue) {
    debugLog('👉 editor.#updateHAForm()');
    debugLog('        ✅ Update HA Form (Before) ------> ', form.data);
    debugLog('        ✅ NewValue: ', newValue);

    if (form.data === undefined || (newValue !== undefined && form.data[key] !== newValue)) {
      debugLog('        ✅ NewValue: update.');
      form.data = {
        ...form.data,
        [key]: newValue,
      };
      debugLog(form.data);
    } else if (newValue === undefined && form.data[key] !== undefined) {
      debugLog('        ✅ key: set undef...');
      form.data = {
        ...form.data,
        [key]: undefined,
      };
    }
    debugLog('        ✅ Update HA Form (after) ------> ', form.data);
  }

  #updateAttributFromEntity(entity, attribute) {
    debugLog('👉 editor.#updateAttributFromEntity()');
    debugLog(`  📎 entity: ${entity}`);
    debugLog(`  📎 attribute: ${attribute}`);

    // Création d'une instance EntityOrValue pour l'entité courante
    const curEntity = new EntityOrValue();
    curEntity.value = this.#config[entity];

    // Si l'entité a changé et que l'entité courante a des attributs, on régénère la liste.
    if (this.#previous[entity] !== this.#config[entity] && curEntity.hasAttribute) {
      this.#previous[entity] = this.#config[entity];
      this.#updateChoices(this.#elements[attribute], attribute, Object.keys(curEntity.attributes));
      debugLog(`        ✅ updateFields - ${entity} attributes list: `, curEntity.attributes);
    }

    // Si l'attribut n'est pas défini dans la config ET
    // que l'entité possède des attributs ET
    // que la valeur du select ne correspond pas encore au defaultAttribute :
    if (this.#config[attribute] === undefined && curEntity.hasAttribute) {
      debugLog(`        ✅ updateFields - Attribute ${attribute} (default): in progress...`);
      this.#applySelectValueOnUpdate(this.#elements[attribute], curEntity.defaultAttribute);
    }

    if (
      this.#config[attribute] &&
      curEntity.hasAttribute &&
      Object.hasOwn(curEntity.attributes, this.#config[attribute]) &&
      this.#elements[attribute].value !== this.#config[attribute]
    ) {
      this.#elements[attribute].value = this.#config[attribute];
      debugLog(`        ✅ updateFields - Attribute ${attribute}: `, curEntity.attributes);
    }

    return curEntity.hasAttribute;
  }
  async #applySelectValueOnUpdate(select, value) {
    await select.updateComplete;

    const values = Array.from(select.children).map((el) => el.getAttribute('value'));
    if (values.includes(value)) {
      select.value = value;
      debugLog('        ✅ applySelectValueOnUpdate - Entity attribute (default): ', value);
    } else {
      debugLog('        ❌ applySelectValueOnUpdate - Default attribute not found in select options', values);
    }
  }
  #updateToggleFields() {
    const hide = this.#config.hide || [];
    const toggleMappings = {
      toggle_force_circular_background: this.#config.force_circular_background === true,
      toggle_unit: this.#config.disable_unit !== true,
      toggle_icon: !hide.includes('icon'),
      toggle_name: !hide.includes('name'),
      toggle_secondary_info: !hide.includes('secondary_info'),
      toggle_progress_bar: !hide.includes('progress_bar'),
    };

    for (const [toggleKey, shouldBeChecked] of Object.entries(toggleMappings)) {
      const toggle = this.#elements[toggleKey];
      if (toggle && toggle.checked !== shouldBeChecked) {
        toggle.checked = shouldBeChecked;
      }
    }
  }

  #onChanged(event) {
    debugLog('👉 editor.#onChanged()');
    debugLog('  📎 event: ', event);
    debugLog('  📎 event.target.id: ', event.target.id);
    this.#sendMessageForUpdate(event);
  }

  #addEventListener() {
    debugLog('👉 editor.#addEventListener');
    const fieldsToProcess = [
      EDITOR_INPUT_FIELDS.basicConfiguration,
      EDITOR_INPUT_FIELDS.content.field,
      EDITOR_INPUT_FIELDS.interaction.field,
      EDITOR_INPUT_FIELDS.theme.field,
    ];
    fieldsToProcess.forEach((fieldObject) => {
      Object.keys(fieldObject).forEach((field) => {
        const value = fieldObject[field]; // Use the correct fieldObject
        this.#addEventListenerFor(value.name, value.type);
      });
    });
  }

  #addEventListenerFor(name, type) {
    debugLog(`👉 Editor.#addEventListenerFor(${name}, ${type})`);
    if (!this.#elements[name]) {
      console.error(`Element ${name} not found!`);
      return;
    }
    const isHASelect = CARD.editor.fields[type]?.element === CARD.editor.fields.select.element;
    const isToggle = CARD.editor.fields[type]?.element === CARD.editor.fields.toggle.element;
    const events = isHASelect ? CARD.interactions.event.HASelect : (isToggle ? CARD.interactions.event.toggle : CARD.interactions.event.other);

    debugLog(`Event: ${events}`);

    if (isHASelect) {
      this.#elements[name].addEventListener(CARD.interactions.event.closed, (event) => {
        event.stopPropagation();
      });
    }
    events.forEach((eventType) => {
      this.#elements[name].addEventListener(eventType, this.#onChanged.bind(this));
    });
  }

  #sendMessageForUpdate(changedEvent) {
    debugLog('👉 editor.#sendMessageForUpdate()');
    debugLog('  📎 ', changedEvent);
    debugLog(`  📎 ${changedEvent.target.id} -> ${changedEvent.target.value !== undefined ? changedEvent.target.value : changedEvent.detail}`);
    const newConfig = Object.assign({}, this.#config);

    switch (changedEvent.target.id) {
      case EDITOR_INPUT_FIELDS.basicConfiguration.attribute.name:
      case EDITOR_INPUT_FIELDS.content.field.max_value_attribute.name:
      case EDITOR_INPUT_FIELDS.content.field.name.name:
      case EDITOR_INPUT_FIELDS.content.field.unit.name:
      case EDITOR_INPUT_FIELDS.theme.field.bar_size.name:
      case EDITOR_INPUT_FIELDS.theme.field.layout.name:
      case EDITOR_INPUT_FIELDS.theme.field.theme.name:
        if (changedEvent.target.value === undefined || changedEvent.target.value === null || changedEvent.target.value.trim() === '') {
          delete newConfig[changedEvent.target.id];
        } else {
          newConfig[changedEvent.target.id] = changedEvent.target.value;
        }
        break;
      case EDITOR_INPUT_FIELDS.content.field.decimal.name:
      case EDITOR_INPUT_FIELDS.content.field.min_value.name: {
        const curValue = parseFloat(changedEvent.target.value);
        if (isNaN(curValue)) {
          delete newConfig[changedEvent.target.id];
        } else {
          newConfig[changedEvent.target.id] = curValue;
        }
        break;
      }
      case EDITOR_INPUT_FIELDS.content.field.max_value.name:
        if (!isNaN(changedEvent.target.value) && changedEvent.target.value.trim() !== '') {
          newConfig[changedEvent.target.id] = parseFloat(changedEvent.target.value);
        } else if (changedEvent.target.value.trim() !== '') {
          newConfig[changedEvent.target.id] = changedEvent.target.value;
        } else {
          delete newConfig[changedEvent.target.id];
        }
        break;
      case EDITOR_INPUT_FIELDS.interaction.field.hold_action.name:
      case EDITOR_INPUT_FIELDS.interaction.field.icon_tap_action.name:
      case EDITOR_INPUT_FIELDS.interaction.field.tap_action.name: {
        newConfig[changedEvent.target.id] = changedEvent.detail.value[changedEvent.target.id];
        break;
      }
      case EDITOR_INPUT_FIELDS.basicConfiguration.entity.name:
      case EDITOR_INPUT_FIELDS.theme.field.icon.name:
      case EDITOR_INPUT_FIELDS.theme.field.bar_color.name:
      case EDITOR_INPUT_FIELDS.theme.field.color.name: {
        if (
          changedEvent?.detail?.value &&
          typeof changedEvent.detail.value[changedEvent.target.id] === 'string' &&
          changedEvent.detail.value[changedEvent.target.id].trim() !== ''
        ) {
          newConfig[changedEvent.target.id] = changedEvent.detail.value[changedEvent.target.id];
        } else {
          delete newConfig[changedEvent.target.id];
        }
        break;
      }
      case EDITOR_INPUT_FIELDS.theme.field.toggleBar.name:
      case EDITOR_INPUT_FIELDS.theme.field.toggleIcon.name:
      case EDITOR_INPUT_FIELDS.theme.field.toggleName.name:
      case EDITOR_INPUT_FIELDS.theme.field.toggleSecondaryInfo.name: {
        const key = changedEvent.target.id.replace('toggle_', '');
        newConfig.hide ??= [];

        if (!changedEvent.target.checked) {
          // Toggle désactivé → on cache
          if (!newConfig.hide.includes(key)) {
            newConfig.hide.push(key);
          }
        } else {
          // Toggle activé → on montre
          const index = newConfig.hide.indexOf(key);
          if (index !== -1) {
            newConfig.hide.splice(index, 1);
          }
          if (newConfig.hide.length === 0) {
            delete newConfig.hide;
          }
        }
        break;
      }
      case EDITOR_INPUT_FIELDS.theme.field.toggleCircular.name:
        if (changedEvent.target.checked) {
          newConfig.force_circular_background = true;
        } else {
          delete newConfig.force_circular_background;
        }
        break;
      case EDITOR_INPUT_FIELDS.theme.field.toggleUnit.name:
        if (!changedEvent.srcElement.checked) {
          newConfig.disable_unit = true;
        } else {
          delete newConfig.disable_unit;
        }
        break;
    }
    if (
      changedEvent.target.id === EDITOR_INPUT_FIELDS.basicConfiguration.entity.name ||
      changedEvent.target.id === EDITOR_INPUT_FIELDS.content.field.max_value.name
    ) {
      const curAttribute =
        changedEvent.target.id === EDITOR_INPUT_FIELDS.basicConfiguration.entity.name
          ? EDITOR_INPUT_FIELDS.basicConfiguration.attribute.name
          : EDITOR_INPUT_FIELDS.content.field.max_value_attribute.name;
      const curEntity = new EntityOrValue();
      curEntity.value = changedEvent.target.value;
      if (!curEntity.hasAttribute) {
        delete newConfig[curAttribute];
      }
      if (changedEvent.target.id === EDITOR_INPUT_FIELDS.basicConfiguration.entity.name && curEntity.unit && newConfig.unit === undefined) {
        newConfig.unit = curEntity.unit;
      }
    }

    this.#sendNewConfig(newConfig);
  }

  #sendNewConfig(newConfig) {
    debugLog('👉 editor.#sendNewConfig()');
    if (newConfig.grid_options) {
      const { grid_options, ...rest } = newConfig;
      newConfig = { ...rest, grid_options };
    }
    debugLog('  📎 newConfig: ', newConfig);
    const messageEvent = new CustomEvent(CARD.interactions.event.configChanged, {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(messageEvent);
  }

  #toggleFieldDisable(key, disable) {
    this.#container.classList.toggle(`${CARD.style.dynamic.hide}-${key}`, disable);
  }

  /**
   * Update a list of choices to a given `<select>` element based on the specified list type.
   */
  #updateChoices(select, type, choices = null) {
    debugLog('👉 editor.#updateChoices()');
    debugLog(`  📎 select: ${select}`);
    debugLog(`  📎 type: ${type}`);
    debugLog(`  📎 choices: ${choices}`);

    select.innerHTML = '';

    const list = [CARD.editor.fields.attribute.type, CARD.editor.fields.max_value_attribute.type].includes(type) ? choices : FIELD_OPTIONS[type];
    if (!list) {
      return;
    }
    debugLog('  📌 list: ', list);

    list.forEach((optionData) => {
      const option = document.createElement(CARD.editor.fields.listItem.element);
      const value = optionData.value !== undefined ? optionData.value : optionData;
      option.setAttribute('value', String(value));

      switch (type) {
        case CARD.editor.fields.layout.type:
        case CARD.editor.fields.theme.type:
        case CARD.editor.fields.bar_size.type: {
          const label = LANGUAGES[this.#currentLanguage].editor.option[type][optionData.value];
          const haIcon = document.createElement(CARD.editor.fields.iconItem.element);
          haIcon.setAttribute(CARD.editor.fields.iconItem.attribute, optionData.icon);
          haIcon.classList.add(CARD.editor.fields.iconItem.class);
          option.appendChild(haIcon);
          option.append(label);
          break;
        }
        case CARD.editor.fields.attribute.type:
        case CARD.editor.fields.max_value_attribute.type:
          option.innerHTML = `${optionData}`;
          break;
      }
      select.appendChild(option);
    });
  }

  #computeCustomLabel(s, label) {
    debugLog('👉 computeCustomLabel()');
    debugLog('  📎 name: ', s.name);
    debugLog('  📎 label: ', label);
    return label;
  }

  /**
   * Creates a form field based on the provided configuration and appends it to a container.
   */
  #createField({ name, label, type, required, isInGroup, width, schema = null }) {
    debugLog('👉 editor.#createField()');
    let inputElement;
    const value = this.#config[name] ?? '';

    switch (type) {
      case CARD.editor.fields.entity.type:
      case CARD.editor.fields.color.type:
      case CARD.editor.fields.icon.type:
      case CARD.editor.fields.tap_action.type:
      case CARD.editor.fields.icon_tap_action.type:
      case CARD.editor.fields.hold_action.type: {
        inputElement = document.createElement(CARD.editor.fields.tap_action.element);
        if (isInGroup) {
          inputElement.classList.add(isInGroup);
        }
        inputElement.style.width = width;
        inputElement.id = name;
        inputElement.hass = this.#hassProvider.hass;
        inputElement.schema = schema;
        inputElement.computeLabel = (s) => this.#computeCustomLabel(s, label);
        inputElement.data = {};
        this.#elements[name] = inputElement;
        return inputElement; //break;
      }
      case CARD.editor.fields.layout.type:
      case CARD.editor.fields.bar_size.type:
      case CARD.editor.fields.theme.type:
      case CARD.editor.fields.attribute.type:
      case CARD.editor.fields.max_value_attribute.type:
        inputElement = document.createElement(CARD.editor.fields[type].element);
        inputElement.popperOptions = '';
        this.#updateChoices(inputElement, type);
        break;
      case CARD.editor.fields.number.type:
        inputElement = document.createElement(CARD.editor.fields.number.element);
        inputElement.type = CARD.editor.fields.number.type;
        break;
      case CARD.editor.fields.toggle.type: {
        inputElement = document.createElement(CARD.editor.fields.container.element);
        inputElement.style.display = 'flex';
        inputElement.style.alignItems = 'center';
        inputElement.style.gap = '8px';

        const toggleLabel = document.createElement(CARD.editor.fields.text.element);
        toggleLabel.textContent = label;

        const toggle = document.createElement(CARD.editor.fields.toggle.element);

        toggle.setAttribute('checked', true);
        toggle.id = name;

        inputElement.appendChild(toggleLabel);
        inputElement.appendChild(toggle);

        this.#elements[name] = toggle;
        return inputElement; //break;
      }
      default:
        inputElement = document.createElement(CARD.editor.fields.default.element);
        inputElement.type = CARD.editor.fields.default.type;
        break;
    }

    this.#elements[name] = inputElement;
    inputElement.style.width = width;
    inputElement.required = required;
    inputElement.label = label;
    inputElement.value = value;
    inputElement.id = name;

    if (isInGroup) {
      inputElement.classList.add(isInGroup);
    }

    return inputElement;
  }

  #makeHelpIcon() {
    const link = document.createElement(CARD.documentation.link.element);
    link.href = CARD.documentation.link.documentationUrl;
    link.target = CARD.documentation.link.linkTarget;
    link.classList.add(CARD.documentation.link.class);
    const shape = document.createElement(CARD.documentation.shape.element);
    shape.classList.add(CARD.documentation.shape.class);

    const questionMark = document.createElement(CARD.documentation.questionMark.element);
    questionMark.classList.add(CARD.documentation.questionMark.class);
    questionMark.setAttribute('icon', CARD.documentation.questionMark.icon);
    Object.assign(questionMark.style, CARD.documentation.questionMark.style);

    shape.appendChild(questionMark);
    link.appendChild(shape);
    return link;
  }

  toggleAccordion(index) {
    const accordionContent = this.#accordionContent[index];
    accordionContent.classList.toggle('expanded');
  }

  #renderFields(parent, inputFields) {
    Object.values(inputFields).forEach((field) => {
      debugLog('#renderFields - field: ', field);
      parent.appendChild(
        this.#createField({
          name: field.name,
          label: LANGUAGES[this.#currentLanguage].editor.field[field.name],
          type: field.type,
          isInGroup: field.isInGroup,
          width: field.width,
          schema: field.schema !== undefined ? field.schema : null,
        })
      );
    });
  }

  #renderAccordion(parent, inputFields) {
    const accordionItem = document.createElement(CARD.editor.fields.accordion.item.element);
    accordionItem.classList.add(CARD.editor.fields.accordion.item.class);
    const index = this.#accordionContent.push(accordionItem) - 1;

    const accordionTitle = document.createElement(CARD.editor.fields.accordion.title.element);
    accordionTitle.classList.add(CARD.editor.fields.accordion.title.class);
    const icon = document.createElement(CARD.editor.fields.accordion.icon.element);
    icon.setAttribute('icon', inputFields.title.icon);
    icon.classList.add(CARD.editor.fields.accordion.icon.class);
    accordionTitle.appendChild(icon);

    const title = document.createTextNode(LANGUAGES[this.#currentLanguage].editor.title[inputFields.title.name]);
    accordionTitle.appendChild(title);

    const accordionArrow = document.createElement(CARD.editor.fields.accordion.arrow.element);
    accordionArrow.classList.add(CARD.editor.fields.accordion.arrow.class);
    accordionArrow.setAttribute('icon', CARD.editor.fields.accordion.arrow.icon);
    accordionTitle.appendChild(accordionArrow);

    accordionTitle.addEventListener(CARD.interactions.event.click, () => {
      this.toggleAccordion(index);
    });
    accordionItem.appendChild(accordionTitle);

    const accordionContent = document.createElement(CARD.editor.fields.accordion.content.element);
    accordionContent.classList.add(CARD.editor.fields.accordion.content.class);

    this.#renderFields(accordionContent, inputFields.field);

    accordionItem.appendChild(accordionContent);
    parent.appendChild(accordionItem);
  }

  /**
   * Renders the editor interface for configuring the card's settings.
   *
   * @returns {void}
   */
  render() {
    const style = document.createElement(CARD.style.element);
    style.textContent = CARD_CSS;
    const fragment = document.createDocumentFragment();
    fragment.appendChild(style);
    this.#container = document.createElement(CARD.editor.fields.container.element);
    this.#container.classList.add(CARD.editor.fields.container.class);

    this.#renderFields(this.#container, EDITOR_INPUT_FIELDS.basicConfiguration);
    this.#renderAccordion(this.#container, EDITOR_INPUT_FIELDS.content);
    this.#renderAccordion(this.#container, EDITOR_INPUT_FIELDS.interaction);
    this.#renderAccordion(this.#container, EDITOR_INPUT_FIELDS.theme);

    this.#container.appendChild(this.#makeHelpIcon());
    fragment.appendChild(this.#container);
    this.shadowRoot.appendChild(fragment);
  }
}

/** --------------------------------------------------------------------------
 * Registers the custom element for the EntityProgressCardEditor editor.
 */
customElements.define(CARD.meta.editor, EntityProgressCardEditor);

