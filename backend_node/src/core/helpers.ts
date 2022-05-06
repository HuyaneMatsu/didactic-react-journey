export function to_string(value: any): string {
    return value.toString();
}

export function to_string_base_16(value: bigint): string {
    return value.toString(16);
}

export function left_fill(string: string, fill_till: number, fill_with: string): string {
    return string.padStart(fill_till, fill_with);
}


export function* iter_dict_items<DictionaryStructure>(
    dictionary: DictionaryStructure
): Iterable<[keyof DictionaryStructure, DictionaryStructure[keyof DictionaryStructure]]> {
    var item: [string, any];

    for (item of Object.entries(dictionary)) {
        yield item as  [keyof DictionaryStructure, DictionaryStructure[keyof DictionaryStructure]];
    }
}


export function build_form_data(data: Record<string, any>): string {
    var form_body: Array<string> = [];
    var encoded_key: string;
    var encoded_value: string;
    var key: string;
    var value: any;

    for ([key, value] of iter_dict_items<Record<string, any>>(data)) {
          var encoded_key = encodeURIComponent(key);
          var encoded_value = encodeURIComponent(value);
          form_body.push([encoded_key, '=', encoded_value].join(''));
    }

    return form_body.join('&');
}
