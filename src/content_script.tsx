// Read hotkeys from preferences

/**
 * Corresponds to the major filter sections in the trade site.
 */
enum MajorFilterCategory {
  TYPE,
    WEAPON,
    ARMOUR,
    SOCKET,
    REQUIREMENTS,
    MAP,
    HEIST,
    ULTIMATUM,
    MISCELLANEOUS,
    TRADE,
    STAT
}

enum FilterType {
  // TODO: Item category
    WEAP_DAMAGE,
    WEAP_CRIT_CHANCE,
    WEAP_PDPS,
    WEAP_APS,
    WEAP_DPS,
    WEAP_EDPS,
    ARMOUR_ARMOUR,
    ARMOUR_ES,
    ARMOUR_BLOCK,
    ARMOUR_EVASION,
    ARMOUR_WARD,
    ARMOUR_BASE_PERCENTILE,
    SOCKET_SOCKETS,
    SOCKET_LINKS,
    REQ_STRENGTH,
    REQ_INT,
    REQ_DEX,
    REQ_LEVEL,
    REQ_CHAR_CLASS,
    MAP_TIER,
    MAP_IIQ,
    MAP_IIR,
    MAP_PACKSIZE,
    MAP_BLIGHTED,
    MAP_BLIGHT_RAVAGED,
    MAP_AREA_LEVEL,
    // Heist, Ultimatum, Trade Filters are unsupported for now.
    MISC_QUALITY,
    MISC_ITEM_LEVEL,
    MISC_GEM_LEVEL,
    MISC_GEM_EXP,
    MISC_FRACTURED,
    MISC_SYNTHESIZED,
    MISC_SEARING_EXARCH,
    MISC_EATER_OF_WORLDS,
    MISC_ALT_ART,
    MISC_IDENTIFIED,
    MISC_CORRUPTED,
    MISC_MIRRORED,
    MISC_SPLIT,
    MISC_CRAFTED,
    MISC_VEILED,
    MISC_ENCHANTED
}

interface TradeFilter {
  /**
   * See MajorFilterCategory.
   */
  majorCategory: MajorFilterCategory;

  /**
   *
   */
  filterType: FilterType;
}

/**
 * Represents a filter that takes a minimum number or a maximum number.
 */
interface MinMaxFilter extends TradeFilter {
  min: number;
  max: number;
}

/**
 * Represents any boolean filter, usually represented by yes/no in
 * the UI.
 */
interface BooleanFilter extends TradeFilter {

}

class FilterFactory {
}
