/**
 * Created by abhinadduri on 8/6/16.
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'search'
})

export class SearchPipe {
    transform(value, query) {
        if (value && query)
            return value.filter((item) => item.name.includes(query))
        else return value;
    }
}