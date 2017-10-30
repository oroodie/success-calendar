export default dateHelper = {

    _months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],

    _getDaysInMonth(month, year) {
        const daysInMonth = [
            31,
            /* Feb */
            ( ( (year%4===0 && year%100!==0) || (year%400===0) ) ? 29 : 28),
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ]
        return daysInMonth[month]
    },

    _switchMonth(next, month) {
        let newMonth =
            /* switch to provided month, if next is null */
            (next === null) ? month
                :
                ( (next)
                    /* next month, check if December (11) ... */
                    ? (month === 11 ? 0 : (month + 1) )
                    /* prev month, check if January (0) ... */
                    : (month === 0 ? 11 : (month - 1) )
                )
        return newMonth
    },

    _switchYear(next, month, year) {
        let newYear =
            /* switch to provided year, if next is null */
            (next === null) ? year
                :
                ( (next)
                    /* next year, check if December (11) ... */
                    ? (month === 11 ? (year + 1) : year)
                    /* prev year, check if January (0) ... */
                    : (month === 0  ? (year - 1) : year)
                )
        return newYear
    },

    _getFormatedDate(d) {
        return (
            d.getFullYear()
            + '-' + ('0'+(d.getMonth()+1) ).slice(-2)
            + '-' + ('0' + d.getDate() ).slice(-2)
        )
    },

    _getStartDate(year /* YYYY */, month /* 0-11 */) {
        return new Date(year, (month || 0), 1)
    },

    _getEndDate(year /* YYYY */, month /* 0-11 */) {
        return new Date(
            year,
            (month >= 0) ? month :  11,
            (month >= 0) ? this._getDaysInMonth(month) : 31
        )
    },

}
