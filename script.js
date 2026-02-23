const defaultConfig = {
  platform_title: 'E-learn Learning Platform',
  hero_description: 'Connecting teachers and students in one unified digital classroom. Experience seamless online education with interactive tools, real-time collaboration, and comprehensive learning resources.',
  school_name: 'Sunrise Academy',
  school_description: 'Welcome to our official E-learn portal! Join over 2,500 students and 150 educators in our digital learning community. Access your courses, assignments, and grades all in one place.',
  primary_color: '#3b82f6',
  secondary_color: '#93c5fd',
  background_color: '#f0f7ff',
  text_color: '#1f2937',
  accent_color: '#2563eb',
  font_family: 'Poppins',
  font_size: 16
};

async function onConfigChange(config) {
  const title = config.platform_title || defaultConfig.platform_title;
  const titleParts = title.split(' ');
  const firstWord = titleParts[0] || 'E-learn';
  const restWords = titleParts.slice(1).join(' ') || 'Learning Platform';
  
  document.getElementById('platform-title').innerHTML = `${firstWord}<br/><span class="text-blue-600">${restWords}</span>`;
  document.getElementById('hero-description').textContent = config.hero_description || defaultConfig.hero_description;
  document.getElementById('school-name').textContent = config.school_name || defaultConfig.school_name;
  document.getElementById('school-description').textContent = config.school_description || defaultConfig.school_description;
  
  const fontFamily = config.font_family || defaultConfig.font_family;
  document.body.style.fontFamily = `${fontFamily}, sans-serif`;
  
  const baseSize = config.font_size || defaultConfig.font_size;
  document.body.style.fontSize = `${baseSize}px`;
}

function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.background_color || defaultConfig.background_color,
        set: (value) => {
          config.background_color = value;
          window.elementSdk.setConfig({ background_color: value });
        }
      },
      {
        get: () => config.secondary_color || defaultConfig.secondary_color,
        set: (value) => {
          config.secondary_color = value;
          window.elementSdk.setConfig({ secondary_color: value });
        }
      },
      {
        get: () => config.text_color || defaultConfig.text_color,
        set: (value) => {
          config.text_color = value;
          window.elementSdk.setConfig({ text_color: value });
        }
      },
      {
        get: () => config.primary_color || defaultConfig.primary_color,
        set: (value) => {
          config.primary_color = value;
          window.elementSdk.setConfig({ primary_color: value });
        }
      },
      {
        get: () => config.accent_color || defaultConfig.accent_color,
        set: (value) => {
          config.accent_color = value;
          window.elementSdk.setConfig({ accent_color: value });
        }
      }
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (value) => {
        config.font_family = value;
        window.elementSdk.setConfig({ font_family: value });
      }
    },
    fontSizeable: {
      get: () => config.font_size || defaultConfig.font_size,
      set: (value) => {
        config.font_size = value;
        window.elementSdk.setConfig({ font_size: value });
      }
    }
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ['platform_title', config.platform_title || defaultConfig.platform_title],
    ['hero_description', config.hero_description || defaultConfig.hero_description],
    ['school_name', config.school_name || defaultConfig.school_name],
    ['school_description', config.school_description || defaultConfig.school_description]
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
}