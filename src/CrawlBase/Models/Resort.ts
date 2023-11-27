export class Resort {
    // base info
    name: string = '';
    url: string = '';
    region: string = '';

    // base stats
    altitudeM: number = -1;
    highestLiftAltitudeM: number = -1;
    slopeLengthKm: number = -1;
    longestRunKm: number = -1;
    liftCount: number = -1;

    // snow stats
    snowActual: SnowActual = new SnowActual();
    snowHistory: SnowHistory[] = [];

    // pricing
    priceStats: PriceInfo[] = [];

    static getCsvHeaders(): { name: string, headers: string[] }[] {
        return [
            {
                name: 'base',
                headers: ['Name', 'URL', 'Region', 'Altitude (m)', 'Highest Lift Altitude (m)', 'Slope Length (km)', 'Longest Run (km)', 'Lift Count']
            },
            {
                name: 'snow-actual',
                headers: ['Name', 'Date', 'Last Snowfall Date', 'Snow Depth Top (cm)', 'Snow Depth Bottom (cm)', 'Open Lift Count', 'Open Slope Length (km)']
            },
            {
                name: 'snow-history',
                headers: ['Name', 'Year Range', 'Month', 'Low Slope Snow Depth (cm)', 'High Slope Snow Depth (cm)']
            },
            {
                name: 'price',
                headers: ['Name', 'Number of Days', 'Price', 'Currency']
            }
        ];
    }

    /**
     * First dimension is the sheet, second dimension is the row, third dimension is the cell value.
     * The sheet and column order matches the headers.
     */
    getCsvValues(): string[][][] {
        var baseInfo = [
            this.name,
            this.url,
            this.region,
            this.altitudeM.toFixed(0),
            this.highestLiftAltitudeM.toFixed(0),
            this.slopeLengthKm.toFixed(0),
            this.longestRunKm.toFixed(0),
            this.liftCount.toFixed(0)
        ];

        var snowActual = [
            this.name,
            this.snowActual.date.toISOString(),
            this.snowActual.lastSnowfallDate?.toISOString() ?? '',
            this.snowActual.snowDepthTopCm.toFixed(0),
            this.snowActual.snowDepthBottomCm.toFixed(0),
            this.snowActual.openLiftCount.toFixed(0),
            this.snowActual.openSlopeKm.toFixed(0)
        ];

        var snowHistory = this.snowHistory.map(x => [
            this.name,
            x.yearRange,
            x.month,
            x.lowSlopeSnowDepthCm.toFixed(0),
            x.highSlopeSnowDepthCm.toFixed(0)
        ]);

        var priceInfo = this.priceStats.map(x => [
            this.name,
            x.numberOfDays.toFixed(0),
            x.price.toFixed(0),
            x.currency
        ]);

        return [
            [baseInfo],
            [snowActual],
            snowHistory,
            priceInfo
        ];
    }
}

export class SnowHistory {
    yearRange: string = '';
    month: string = '';
    lowSlopeSnowDepthCm: number = -1;
    highSlopeSnowDepthCm: number = -1;
}

export class SnowActual {
    date: Date = new Date();
    lastSnowfallDate: Date | null = null;
    snowDepthTopCm: number = -1;
    snowDepthBottomCm: number = -1;
    openLiftCount: number = -1;
    openSlopeKm: number = -1;
}

export class PriceInfo {
    numberOfDays: number = -1;
    price: number = -1;
    currency: string = '';
}
