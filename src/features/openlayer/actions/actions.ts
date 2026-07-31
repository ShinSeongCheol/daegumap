'use server'

import { CommercialArea } from '@/src/types';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

interface Props {
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number
}

export async function loadCommercialArea({minLng, minLat, maxLng, maxLat}:Props) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore);  

    const {data, error} = await supabase.from('commercial_area')
        .select<string, CommercialArea>('*')
        .gte('longitude', minLng)
        .lte('longitude', maxLng)
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .limit(10000);

    console.log(data);

    return data
}