import express, { Request } from "express";
import { alternating, HttpRouter, HttpServer, range, spaced } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';
import { isAs1 } from "./versions";
import { getSetupXml } from "./as1setup";
import { getServersXml } from "../servers";

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  const v2 = new HttpRouter(['play', 'v2'], server);

  const games = new HttpRouter('games', v2);

  const content = new HttpRouter('content', v2);

  const globalContent = new HttpRouter('global', content);

  const globalContentContent = new HttpRouter('content', globalContent);

  const telescope = new HttpRouter('telescope', globalContent);

  const localContent = new HttpRouter('local', content);

  const localContentEn = new HttpRouter('en', localContent);

  const client = new HttpRouter('client', v2);

  const rooms = new HttpRouter('rooms', globalContent);

  const stage = new HttpRouter('stage.swf', rooms);

  const plaza = new HttpRouter('plaza.swf', rooms);

  const rink = new HttpRouter('rink.swf', rooms);

  const dojoCourtyard = new HttpRouter('dojoext.swf', rooms);

  const globalCrumbs = new HttpRouter(['crumbs', 'global_crumbs.swf'], globalContent);

  const map = new HttpRouter('map.swf', globalContentContent);

  const binoculars = new HttpRouter('binoculars', globalContent);

  const iglooBackground = new HttpRouter(['igloo', 'assets', 'igloo_background.swf'], globalContent);

  const scavengerHunt = new HttpRouter('scavenger_hunt', globalContent);

  const login = new HttpRouter('login', localContentEn);

  const localEnCatalogues = new HttpRouter('catalogues', localContentEn);

  const enCloseUps = new HttpRouter('close_ups', localContentEn);

  const enNews = new HttpRouter('news', localContentEn);

  const worldAchievements = new HttpRouter(['web_service', 'worldachievements.xml'], server);

  const emptyBinoculars = new HttpRouter('empty.swf', binoculars);

  const iglooMusic = new HttpRouter('igloo_music.swf', globalContentContent);

  const prizebooth = new HttpRouter('prizebooth.swf', localEnCatalogues);

  const prizeboothmember = new HttpRouter('prizeboothmember.swf', localEnCatalogues);

  const costume = new HttpRouter('costume.swf', localEnCatalogues);

  const sportCatalogue = new HttpRouter('sport.swf', localEnCatalogues);
  
  const furnitureCatalogue = new HttpRouter('furniture.swf', localEnCatalogues);

  const clothingCatalogue = new HttpRouter('clothing.swf', localEnCatalogues);

  const iglooCatalogue = new HttpRouter('igloo.swf', localEnCatalogues);

  const petFurnitureCatalogue = new HttpRouter('pet.swf', localEnCatalogues);

  const ninjaCatalogue = new HttpRouter('ninja.swf', localEnCatalogues);

  const newCrumbs = new HttpRouter('news_crumbs.swf', enNews);

  const library = new HttpRouter(['forms', 'library.swf'], localContentEn);

  const puffleAdoptionPostcard = new HttpRouter(['postcards', '111.swf'], localContentEn);

  const music = new HttpRouter('music', server);

  const oldRooms = new HttpRouter(['artwork', 'rooms'], server);

  const oldMap = new HttpRouter(['artwork', 'maps', 'island5.swf'], server);

  const oldTown = new HttpRouter('town10.swf', oldRooms);

  const oldPlaza = new HttpRouter('plaza12.swf', oldRooms);

  const oldForts = new HttpRouter('forts12.swf', oldRooms);

  const oldVillage = new HttpRouter('village11.swf', oldRooms);

  const chat = new HttpRouter('chat291.swf', server);

  // TODO a better system for handling these special medias
  // entrypoint for as2 client
  server.get('boots.swf', (s) => {
    return `default/special/boots${s.settings.fps30 ? '30' : '24'}.swf`
  });
  
  server.getData(['en', 'web_service', 'stamps.json'], (s) => {
    return getStampbook(s.settings.version);
  })

  games.get(['thinice', 'ThinIce.swf'], (s) => {
    let suffix = s.settings.thin_ice_igt ? 'IGT' : 'Vanilla';
    if (s.settings.thin_ice_igt) {
      suffix += s.settings.fps30 ? '30' : '24'
    }
    return `default/special/ThinIce${suffix}.swf`
  })

  games.get(['dancing', 'dance.swf'], (s) => {
    return `default/special/dance_contest/${s.settings.swap_dance_arrow ? 'swapped' : 'vanilla'}.swf`;
  });

  games.get(['book1', 'bootstrap.swf'], (s) => {
    return `default/special/my_puffle/${s.settings.modern_my_puffle ? '2013' : 'original'}.swf`
  });

  games.get(['jetpack', 'JetpackAdventures.swf'], (s) => {
    return `default/special/jet_pack_adventure/${s.settings.jpa_level_selector ? 'level_selector' : 'vanilla'}.swf`;
  });

  games.get(['paddle', 'paddle.swf'], (s) => {
    // orange puffle was already in-game but seems like it wasnt in Fair 2010
    return `default/paddle/white.swf`;
  });

  // BETA TEST PARTY
  range('2005-Sep-21', '2005-Sep-22', [
    [oldRooms, 'default/parties/2005/beta']
  ])

  // HALLOWEEN PARTY 2005
  range('2005-Oct-27', '2005-Nov-01', [
    [oldRooms, 'default/parties/2005/halloween']
  ])

  // PUFFLE DISCOVERY
  range('2005-Nov-15', '2005-Dec-05', [
    [oldRooms, 'default/parties/2005/puffle_discovery']
  ])

  // CHRISTMAS 2005
  range('2005-Dec-22', '2005-Dec-26', [
    [oldRooms, 'default/parties/2005/christmas']
  ])

  // WINTER LUAU
  range('2006-Jan-27', '2006-Jan-30', [
    [oldRooms, 'default/parties/2006/winter_luau']
  ])

  // VALENTINE'S DAY CELEBRATION
  range('2006-Feb-14', '2006-Feb-15', [
    [oldRooms, 'default/parties/2006/valentine_day']
  ])

  // PIZZA PARLOR OPENING PARTY
  range('2006-Feb-24', '2006-Feb-28', [
    [oldRooms, 'default/parties/2006/pizza_party']
  ])

  // APRIL FOOLS PARTY 2006
  range('2006-Mar-31', '2006-Apr-03', [
    [oldRooms, 'default/parties/2006/april_fools']
  ])

  // HALLOWEEN PARTY 2010
  range('2010-Oct-28', '2010-Nov-24',
    [
      [rooms, 'default/parties/2010/halloween/rooms'],
      [rink, 'default/parties/2010/halloween/rooms/rink.swf'],
      [map, 'default/parties/2010/halloween/map.swf'],
      [telescope, 'default/parties/2010/halloween/telescope'],
      [globalCrumbs, 'default/parties/2010/halloween/global_crumbs.swf'],
      [binoculars, 'default/parties/2010/halloween/binoculars'],
      [iglooBackground, 'default/parties/2010/halloween/igloo_background.swf'],
      [scavengerHunt, 'default/parties/2010/halloween/scavenger_hunt'],
      [localEnCatalogues, 'default/parties/2010/halloween/catalogues'],
      [login, 'default/parties/2010/halloween/login'],
      [client, 'default/parties/2010/halloween/client'],
      [worldAchievements, 'default/parties/2010/halloween/worldachievements.xml']
    ]
  )

  // FAIR 2010
  range('2010-Sep-03', '2010-Sep-24',[
    [globalCrumbs, 'default/parties/2010/fair/global_crumbs.swf'],
    [rooms, 'default/parties/2010/fair/rooms'],
    [login, 'default/parties/2010/fair/login'],
    [client, 'default/parties/2010/fair/client'],
    [worldAchievements, 'default/parties/2010/fair/worldachievements.xml']
  ]);

  // FAIR 2010 first half
  range('2010-Sep-03', '2010-Sep-10', [
    [prizebooth, 'default/parties/2010/fair/start/prizebooth.swf'],
    [prizeboothmember, 'default/parties/2010/fair/start/prizeboothmember.swf']
  ])

  // FAIR 2010 second half
  range('2010-Sep-10', '2010-Sep-24', [
    [prizebooth, 'default/parties/2010/fair/end/prizebooth.swf'],
    [prizeboothmember, 'default/parties/2010/fair/end/prizeboothmember.swf']
  ])

  // 5th ANNIVERSARY
  range('2010-Oct-23', '2010-Oct-28', [
    [rooms, 'default/parties/2010/anniversary/rooms'],
    [globalCrumbs, 'default/parties/2010/anniversary/global_crumbs.swf']
  ]);

  alternating(
    [stage],
    [
      ['2010-Sep-03', 'default/stage/squidzoid/2009_10/stage.swf'],
      ['2010-Sep-24', 'default/stage/fairy/stage.swf'],
      ['2010-Oct-23', 'default/stage/bamboo/stage.swf'],
      ['2010-Nov-24', 'default/stage/planety/stage.swf']
    ]
  );

  alternating(
    [rink],
    [
      ['2010-Sep-03', 'default/stadium/2010_05/rink.swf'],
      ['2010-Sep-24', 'default/parties/2010/stadium_games/rink.swf']
    ]
  );

  alternating(
    [dojoCourtyard],
    [
      ['2010-Sep-03', 'default/cardjitsu/fireext.swf'],
      ['2010-Nov-24', 'default/cardjitsu/waterext.swf']
    ]
  )

  range('2010-Oct-23', '2010-Oct-28', [
    [emptyBinoculars, 'default/binoculars/storm_on_horizon.swf']
  ])

  alternating([iglooMusic],
    [
      ['2010-Sep-03', 'default/igloo/2010_08_20/igloo_music.swf'],
      ['2010-Nov-24', 'default/igloo/2010_11_12/igloo_music.swf']
    ]
  )

  alternating([map],
    [
      ['2010-Sep-24', 'default/map/2010_09_24.swf']
    ]
  );

  globalContent.get('tickets.swf', () => {
    return `parties/2010/fair/tickets.swf`
  })

  globalContent.get('ticket_icon.swf', () => {
    return `parties/2010/fair/ticket_icon.swf`
  })

  spaced([globalCrumbs], [
    ['2010-Sep-24', '2010-Oct-23', 'default/parties/2010/stadium_games/global_crumbs.swf']
  ]);

  globalContent.dir('clothing', (s) => {
    return s.settings.clothing ? 'clothing' : undefined;
  })

  globalContent.dir('music', () => {
    return 'default/music'
  })

  // as1 music
  music.dir('', () => {
    return 'default/static/as2/play/v2/content/global/music'
  })

  music.dir('', () => {
    return 'default/music'
  })

  globalContent.dir('furniture', () => {
    return 'default/furniture'
  })

  server.getData('servers.xml', getServersXml)

  // STAGE PLAYS
  alternating(
    [plaza, costume],
    [
      ['2010-Sep-03', '', 'default/stage/squidzoid/2011_03/costume.swf'],
      ['2010-Sep-24', 'default/stage/fairy/plaza.swf', 'default/stage/fairy/costume.swf'],
      ['2010-Oct-23', 'default/stage/bamboo/plaza.swf', 'default/stage/bamboo/costume.swf'],
      ['2010-Nov-24', 'default/stage/planety/plaza.swf', 'default/stage/planety/costume.swf']
    ]
  )

  alternating([sportCatalogue], [
    ['2010-Sep-03', 'default/stadium/2010_05/sport.swf'],
    ['2010-Sep-24', 'default/parties/2010/stadium_games/sport.swf']
  ])

  alternating([furnitureCatalogue], [
    ['2010-Sep-03', 'default/igloo/2010_08_20/furniture.swf'],
    ['2010-Sep-24', 'default/igloo/2010_09_24/furniture.swf'],
    ['2010-Oct-23', 'default/igloo/2010_10_15/furniture.swf'],
    ['2010-Nov-24', 'default/igloo/2010_11_12/furniture.swf']
  ])

  alternating([clothingCatalogue], [
    ['2010-Sep-03', 'default/clothing/2010_09_03.swf'],
    ['2010-Oct-23', 'default/clothing/2010_10_1.swf'],
    ['2010-Nov-24', 'default/clothing/2010_11_05.swf']
  ])

  alternating([iglooCatalogue], [
    ['2010-Sep-03', 'default/igloo/2010_08_20/igloo.swf'],
    ['2010-Nov-24', 'default/igloo/2010_11_12/igloo.swf']
  ])

  alternating([petFurnitureCatalogue], [
    ['2010-Sep-03', 'default/puffle/2010_03_19/pets.swf']
  ])

  alternating([puffleAdoptionPostcard], [
    ['2010-Sep-03', 'default/puffle/2010_02_25/111.swf']
  ])

  alternating([ninjaCatalogue], [
    ['2010-Sep-03', 'default/ninja/2009_11_13/ninja.swf']
  ])

  alternating([newCrumbs], [
    ['2010-Sep-03', 'default/news_crumbs/2010_09_02.swf'],
    ['2010-Sep-10', 'default/news_crumbs/2010_09_09.swf'],
    ['2010-Sep-24', 'default/news_crumbs/2010_09_23.swf'],
    ['2010-Oct-23', 'default/news_crumbs/2010_10_21.swf'],
    ['2010-Oct-28', 'default/news_crumbs/2010_10_28.swf'],
    ['2010-Nov-24', 'default/news_crumbs/2010_11_11.swf']
  ])

  enNews.dir('', () => {
    return 'default/newspapers';
  })
  
  localContentEn.get(['membership', 'party3.swf'], () => {
    return `parties/2010/halloween/membership_party3.swf`
  })

  enCloseUps.get('poster.swf', () => {
    return 'default/parties/2010/fair/poster.swf'
  })

  enCloseUps.get('halloweenposter.swf', () => {
    return 'default/parties/2010/halloween/poster.swf'
  })

  alternating([library], [
    ['2010-Sep-03', 'default/library/2009_10_24.swf'],
    ['2010-Oct-23', 'default/library/2010_10_23.swf']
  ])

  client.get('shell.swf', (s) => {
    return `default/special/shell/${s.settings.remove_idle ? 'no_idle' : 'vanilla'}.swf`
  })

  alternating([chat], [
    ['2005-Aug-22', 'default/chat/chat_early.swf'],
    ['2005-Oct-24', 'default/chat/chat291.swf']
  ])

  alternating([oldTown], [
    ['2005-Aug-22', 'default/rooms/town/town_no_snow_forts.swf'],
    ['2005-Sep-12', 'default/rooms/town/town10.swf']
  ])

  alternating([oldPlaza], [
    ['2006-Feb-24', 'default/rooms/plaza/plaza_pre_pet.swf'],
    ['2006-Mar-17', 'default/rooms/plaza/plaza12.swf']
  ])

  alternating([oldMap], [
    ['2005-Aug-22', 'default/map/island_original.swf'],
    ['2005-Sep-12', 'default/map/island3.swf'],
    ['2006-Feb-28', 'default/map/island5_pre_berg.swf'],
    ['2006-Mar-29', 'default/map/island5.swf']
  ])

  alternating([oldVillage], [
    ['2005-Aug-22', 'default/rooms/village/village_only_dock.swf'],
    ['2005-Nov-03', 'default/rooms/village/village_pre_mountain.swf'],
    ['2005-Nov-18', 'default/rooms/village/village_pre_lodge.swf'],
    ['2005-Dec-22', 'default/rooms/village/village11.swf']
  ])
  
  alternating([oldForts], [
    ['2005-Aug-22', 'default/rooms/forts/forts_original.swf'],
    ['2005-Dec-14', 'default/rooms/forts/forts3.swf'],
    ['2006-Feb-24', 'default/rooms/forts/forts12.swf']
  ])

  server.get('', (s) => {
    if (isAs1(s.settings.version)) {
      return 'default/special/index.html/as1-website.html';
    } else {
      return `default/special/index.html/${s.settings.minified_website ? 'minified' : 'as2-website'}.html`
    }
  });

  server.dir(['artwork', 'items'], () => {
    return 'clothing/sprites'
  })

  server.getData('setup.xml', (s) => {
    return getSetupXml(s.settings.version);
  })
  
  // STATIC SERVING
  server.dir('', (s) => {
    if (isAs1(s.settings.version)) {
      return 'default/static/as1'
    } else {
      return 'default/static/as2'
    }
  })
  
  return server
}