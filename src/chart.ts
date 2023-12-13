import ChartJSImage from 'chart.js-image';
import { Notes } from './types';
import { readFileSync, writeFileSync } from 'fs';

const MEAN_RECORDS_PATH = "mean.json";

export function getChartDataURL(notes: Notes) {
    let records: {self: number, class: number, date: string}[] = [];
    try {
        const text = readFileSync(MEAN_RECORDS_PATH).toString("utf8");
        records = JSON.parse(text) || [];
    } catch (error) {}

    const date = new Date().toLocaleDateString();
    const clean = notes.listeDevoirs.V.filter(a=>!isNaN(parseFloat(a.note.V.replace(",", "."))));
    
    const selfMean = clean.reduce((a, b) => a +  parseFloat(b.note.V.replace(",", "."))/ parseInt(b.bareme.V) * 20, 0) / clean.length;
    const classMean = clean.reduce((a, b) => a + parseFloat(b.moyenne.V.replace(",", "."))/ parseInt(b.bareme.V) * 20, 0) / clean.length;

    records.push({self: selfMean, class: classMean, date});

    const data = {
        "type": "line",
        "data": {
            "labels": records.map((e) => e.date),
            "datasets": [
                {
                    "label": "Self",
                    "borderColor": "rgb(255,+99,+132)",
                    "backgroundColor": "rgba(0,0,0,0)",
                    "data":  records.map((e) => e.self)
                },
                {
                    "label": "Class",
                    "borderColor": "rgb(54,+162,+235)",
                    "backgroundColor": "rgba(0,0,0,0)",

                    "data":  records.map((e) => e.class)
                }
            ]
        },
        "options": {
            "title": {
                "display": false,
            },
            legend: {
                position: 'top',
                display: false
            },
            "scales": {
                "xAxes": [
                    {
                        "scaleLabel": {
                            "display": false,
                        }
                    }
                ],
                "yAxes": [
                    {
                        min: 0,
                        max: 200,
                        "scaleLabel": {
                            "display": false,
                        }
                    }
                ]
            }
        }
    }

    const line_chart = new ChartJSImage().chart(data as unknown as string)
        .backgroundColor('white')
        .width("500") // 500px
        .height("200"); // 300px

    writeFileSync(MEAN_RECORDS_PATH, JSON.stringify(records));

    return line_chart.toDataURI();
}
