import { useEffect, useState } from 'react';
import { Slider, Stack, TextField, Typography } from '@mui/material';

import type { BookSearchParams } from '../../../validations';
import type { BooksPriceRangeMeta } from '../../../types';


type BooksPriceFilterProps = {
    priceMin: number | undefined;
    priceMax: number | undefined;
    priceRangeMeta: BooksPriceRangeMeta;
    updateParams: (params: Partial<BookSearchParams>) => void;
};


const BooksPriceFilter = (props: BooksPriceFilterProps) => {
    const { priceMin, priceMax, priceRangeMeta, updateParams } = props;
    const [localMin, setLocalMin] = useState(priceMin);
    const [localMax, setLocalMax] = useState(priceMax);

    useEffect(() => {
        if (priceMin === undefined && priceMax === undefined) {
            setLocalMin(priceRangeMeta.priceMin);
            setLocalMax(priceRangeMeta.priceMax);
            return;
        }
    }, [priceMin, priceMax, priceRangeMeta.priceMin, priceRangeMeta.priceMax]);

    return (
        
        <Stack
            direction={'column'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <Typography variant='subtitle1'>Price range</Typography>
            <Stack
                direction={'row'}
                justifyContent={'space-evenly'}
                alignItems={'center'}
            >
                <TextField
                    value={localMin}
                    onChange={(e) => {
                        if(isNaN(Number(e.target.value))) return;
                        const newLocalMin = Number(e.target.value);
                        setLocalMin(newLocalMin);
                    }}
                    onBlur={(e) => {
                        const value = Number(e.target.value);
                        const upperLimit = (localMax || priceRangeMeta.priceMax) - 1;
                        const newPriceMin = Math.min(value, upperLimit);
                        if(newPriceMin < upperLimit) {
                            updateParams({
                                priceMin: newPriceMin,
                                priceMax: upperLimit,
                                page: 1
                            });
                        }
                        setLocalMin(newPriceMin);
                    }}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    size="small"
                    error={!!localMin && !!localMax && localMin > localMax}
                />
                <Slider
                    value={[localMin || priceRangeMeta.priceMin, localMax || priceRangeMeta.priceMax]}
                    min={priceRangeMeta.priceMin}
                    max={priceRangeMeta.priceMax}
                    step={1}
                    disableSwap
                    onChange={(_, value) => {
                        const [min, max] = value as number[];
                        updateParams({
                            priceMin: min,
                            priceMax: Math.min(max, priceRangeMeta.priceMax),
                            page: 1,
                        });
                        setLocalMin(min);
                        setLocalMax(max);
                    }}
                />
                <TextField
                    value={localMax}
                    onChange={(e) => {
                        if(isNaN(Number(e.target.value))) return;
                        const newLocalMax = Number(e.target.value);
                        setLocalMax(newLocalMax);
                    }}
                    onBlur={(e) => {
                        const value = Number(e.target.value);
                        const lowerLimit = (localMin || priceRangeMeta.priceMin) + 1;
                        const newPriceMax = Math.max(lowerLimit, value);
                        updateParams({
                            priceMax: newPriceMax,
                            page: 1
                        });
                        setLocalMax(newPriceMax);
                    }}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    size="small"
                    error={!!localMin && !!localMax && localMin > localMax}
                />
            </Stack>
            {
                !!localMin && !!localMax && localMin > localMax &&
                <Typography variant='caption' color='error'>
                    Min price must be less than max price
                </Typography>
            }
        </Stack>
    );
};

export default BooksPriceFilter;