export function get_from_nullable_dict(dictionary, key, default_value) {
    if (dictionary === null) {
        return default_value;
    }

    return get_from_dict(dictionary, key, default_value);
}

export function get_from_dict(dictionary, key, default_value) {
    var value = dictionary[key];
    if (value === undefined) {
        return default_value;
    }

    return value;
}

export function choice(list_) {
    return list_[Math.floor(Math.random() * list_.length)]
}


export function to_string(value) {
    return value.toString();
}

export function to_string_base_16(value) {
    return value.toString(16);
}

export function left_fill(string, fill_till, fill_with) {
    return string.padStart(fill_till, fill_with);
}


export function format_timestamp(timestamp) {
    return format_date(new Date(timestamp));
}

export function format_date(date) {
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


export function remove_from_list(list_, to_remove) {
    var index = list_.indexOf(to_remove);
    var removed;

    if (index > -1) {
        list_.splice(index, 1);
        removed = true;
    } else {
        removed = false;
    }

    return removed;
}


var INT_REGEX = new RegExp('0*([0-9]+)');

export function int_field_validator(value, default_value, max_value) {
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
