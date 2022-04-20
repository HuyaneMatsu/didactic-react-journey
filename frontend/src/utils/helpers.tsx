import {BASE_TITLE} from './../constants';


export function get_from_nullable_dict(dictionary: null | Record<string, any>, key: string, default_value: any): any {
    if (dictionary === null) {
        return default_value;
    }

    return get_from_dict(dictionary, key, default_value);
}

export function get_from_dict(dictionary: Record<string, any>, key: string, default_value: any): any {
    var value = dictionary[key];
    if (value === undefined) {
        return default_value;
    }

    return value;
}

export function choice(list_: Array<any>): any {
    return list_[Math.floor(Math.random() * list_.length)]
}


export function to_string(value: any): string {
    return value.toString();
}

export function to_string_base_16(value: bigint): string {
    return value.toString(16);
}

export function left_fill(string: string, fill_till: number, fill_with: string): string {
    return string.padStart(fill_till, fill_with);
}


export function format_timestamp(timestamp: string): string {
    return format_date(new Date(timestamp));
}

export function format_date(date: Date): string {
    return [
        left_fill(to_string(date.getUTCFullYear()), 4, '0'),
        '-',
        left_fill(to_string(date.getUTCMonth() + 1), 2, '0'),
        '-',
        left_fill(to_string(date.getUTCDate()), 2, '0'),
        ' ',
        left_fill(to_string(date.getUTCHours()), 2, '0'),
        ':',
        left_fill(to_string(date.getUTCMinutes()), 2, '0'),
        ':',
        left_fill(to_string(date.getUTCSeconds()), 2, '0'),
    ].join('')
}


export function remove_from_list(list_: Array<any>, to_remove: any): boolean {
    var index = list_.indexOf(to_remove);
    var removed: boolean;

    if (index > -1) {
        list_.splice(index, 1);
        removed = true;
    } else {
        removed = false;
    }

    return removed;
}


var INT_REGEX = new RegExp('0*([0-9]+)');

export function int_field_validator(value: string, default_value: string, max_value: number): string {
    if (! value) {
        return value;
    }

    var match = INT_REGEX.exec(value);
    if (match === null) {
        return default_value;
    }

    var matched_value = match[1];
    var integer_value = Number(matched_value);
    if (integer_value > max_value) {
        return to_string(max_value);
    }

    return matched_value;
}


export function set_title(title: null | string): void {
    if (title === null) {
        title = BASE_TITLE;
    } else {
        title = [BASE_TITLE, ' ', title].join('');
    }

    document.title = title;
}
