const createStatus = (dataset) => {
    dataset.status = {
        icon:'',
        iconClass:''
    };
    for(let x of dataset.data) {
        if (x >= dataset.val2.value) {
            dataset.status.icon = 'check_circle';
            dataset.status.iconClass = 'green';
        } else if (x < dataset.val1.value) {
            dataset.status.icon = 'error';
            dataset.status.iconClass = 'red';
        } else {
            dataset.status.icon = 'warning';
            dataset.status.iconClass = 'orange';
        }
    }
};

module.exports = createStatus;