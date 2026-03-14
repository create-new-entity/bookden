
/* 
    Note to future self:

    A bunch of custom autocomplete components for different use cases:
    SearchInput, SingleSelectAutoComplete,
    MultiSelectAutoComplete, MultiValueFreeInput.
*/

/* 
    SearchInput:
    Allow freely type a search term and
    show recently searched values as dropdown options.
*/
export { default as SearchInput } from './SearchInput';


/*
    SingleSelectAutoComplete:
    Force a single selection and allow typing to search
    from a predefined list of options.
*/
export { default as SingleSelectAutoComplete } from './SingleSelectAutoComplete';


/*
    MultiSelectAutoComplete:
    Allow search and selection of multiple values
    from a predefined list of options.
*/
export { default as MultiSelectAutoComplete } from './MultiSelectAutoComplete';


/*
    MultiValueFreeInput:
    Freely type in and allow multiple values.  
*/
export { default as MultiValueFreeInput } from './MultiValueFreeInput';


// Other custom components
export { default as CustomModal, type CustomModalRef } from './CustomModal';
export { default as CustomPagination } from './CustomPagination';
export { default as CustomSelect } from './CustomSelect';
export { default as CustomTextField } from './CustomTextField';
export { default as Carousel } from './Carousel/Carousel';

export * from './Carousel';