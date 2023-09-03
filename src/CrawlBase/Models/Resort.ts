export class Resort {
    // base info
    name: string = '';
    url: string = '';
    region: string = '';

    // slope stats
    altitudeM: number = -1;
    highestLiftAltitudeM: number = -1;
    slopeLengthKm: number = -1;
    longestRunKm: number = -1;
    liftCount: number = -1;

    // snow stats
    snowStats: SnowInfo[] = [];

    // pricing
    priceStats: PriceInfo[] = [];

    /**
     * First dimension is the sheet, second dimension is the header value
     */
    static getCsvHeaders(): string[][] {
        return [
            ['Name', 'URL', 'Region', 'Altitude (m)', 'Highest Lift Altitude (m)', 'Slope Length (km)', 'Longest Run (km)', 'Lift Count'],
            ['Name', 'Year Range', 'Month', 'Low Slope Snow Depth (cm)', 'High Slope Snow Depth (cm)'],
            ['Name', 'Number of Days', 'Price', 'Currency']
        ]
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
        var snowInfo = this.snowStats.map(x => [this.name, x.yearRange, x.month, x.lowSlopeSnowDepthCm.toFixed(0), x.highSlopeSnowDepthCm.toFixed(0)]);
        var priceInfo = this.priceStats.map(x => [this.name, x.numberOfDays.toFixed(0), x.price.toFixed(0), x.currency]);

        return [
            [baseInfo],
            snowInfo,
            priceInfo
        ];
    }
}

export class SnowInfo {
    yearRange: string = '';
    month: string = '';
    lowSlopeSnowDepthCm: number = -1;
    highSlopeSnowDepthCm: number = -1;
}

export class PriceInfo {
    numberOfDays: number = -1;
    price: number = -1;
    currency: string = '';
}
