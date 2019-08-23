const createStatus = require('../../modules/createStatus');
const indicators = async (parent, args, {connect}) => {
    try {
        let indicators;
        if(parent.link) {
            indicators = await connect.execute(`
            SELECT 
                ri.id,
                i.name,
                i.source,
                ri.active,
                CONCAT(cv1.value, ',', cv1.label) AS val1,
                CONCAT(cv2.value, ',', cv2.label) AS val2
            FROM relations_indicators ri
            INNER JOIN indicators i ON ri.indicator_id = i.id AND i.id != 0
            LEFT JOIN control_values_relations cv1 
                ON cv1.indicator_id = i.id
                AND cv1.label = 'min'
            LEFT JOIN control_values_relations cv2 
                ON cv2.indicator_id = i.id
                AND cv2.label = 'max'
            WHERE ri.link_id = ${parent.id} AND active = 1
        `);
        indicators = [...indicators[0]];
        
        } else {
            let id = parent.datasetID ? parent.datasetID : parent.id;
            indicators = await connect.execute(`
                SELECT 
                    ri.id,
                    i.name,
                    i.source,
                    ri.active,
                    CONCAT(cv1.value, ',', cv1.label) AS val1,
                    CONCAT(cv2.value, ',', cv2.label) AS val2
                FROM relations_indicators ri
                INNER JOIN indicators i ON ri.indicator_id = i.id AND i.id != 0
                LEFT JOIN control_values_relations cv1 
                    ON cv1.indicator_id = i.id
                    AND cv1.label = 'min'
                LEFT JOIN control_values_relations cv2 
                    ON cv2.indicator_id = i.id
                    AND cv2.label = 'max'
                WHERE ri.dataset_id = ${id} AND active = 1
            `);
            indicators = [...indicators[0]];
        }
        let result = [];
        for(let o of indicators) {
            let idx = result.push({
                id: o.id,
                name: o.name,
                data: [10000, 20000, 30000],
                labels: ['08.17', '08.18', '08.20'],
                val1:{
                    value: o.val1 ? o.val1.split(',')[0] : 0,
                    label: o.val1 ? o.val1.split(',')[1] : ''
                },
                val2: {
                    value: o.val2 ? o.val2.split(',')[0] : 0,
                    label: o.val2 ? o.val2.split(',')[1] : ''
                },
                source: o.source || '',
                active: o.active
            });
            createStatus(result[idx - 1]);
        }
        return result;
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    indicators
}