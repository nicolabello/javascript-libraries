export class Regexp {

  public static email = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;
  public static phone = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

  public static removeExtraSpaces(s: string): string {
    return s ? s.trim().replace(/\s+/g, ' ') : '';
  }

  // Escape for regexp as suggested in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  public static escapePattern(pattern: string): string {
    return pattern?.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  public static getMatchAnyRegExp(pattern: string): RegExp {
    return this.getMatchRegExp(pattern, '|');
  }

  public static getMatchAllRegExp(pattern: string): RegExp {
    return this.getMatchRegExp(pattern, '.*?');
  }

  public static getFullMatchRegExp(pattern: string, flags: string = 'i'): RegExp {
    pattern = `^${Regexp.escapePattern(pattern)}$`;
    // return pattern ? new RegExp(pattern, flags) : null;
    return new RegExp(pattern, flags);
  }

  private static getMatchRegExp(pattern: string, glue: string): RegExp {
    pattern = Regexp.removeExtraSpaces(Regexp.escapePattern(pattern)).replace(' ', glue);
    // return pattern ? new RegExp(pattern, 'gi') : null;
    return new RegExp(pattern, 'gi');
  }

}
