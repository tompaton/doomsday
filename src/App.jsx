import { createSignal, createSelector } from "solid-js";
import { For, Show } from "solid-js";
import styles from './App.module.css';

const CENTURY = {
    1800: 5,
    1900: 3,
    2000: 2,
    2100: 0,
    2200: 5,
    2300: 3,
};

const MONTH = {
    1: 3,
    2: 28,
    3: 14,
    4: 4,
    5: 9,
    6: 6,
    7: 11,
    8: 8,
    9: 5,
    10: 10,
    11: 7,
    12: 12,
};

const MONTH_LEAP = {...MONTH, 1: 4, 2: 29};

const MONTH_NAME = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
};

const MNEMONIC = {
    1: '4 on leap years, 3 otherwise',
    2: 'last day of February',
    3: '3-14 (pi)',
    4: '4-4 (even)',
    5: '5-9 (opposite of September)',
    6: '6-6 (even)',
    7: '7-eleven',
    8: '8-8 (even)',
    9: '9 to 5',
    10: '10-10 (even)',
    11: '11-7 (opposite of July)',
    12: '12-12 (even)',
};

const DAY = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};

function App() {
    const [date, setDate] = createSignal(new Date().toISOString().substr(0, 10));
    const year4 = () => date().substr(0, 4);
    const century = () => date().substr(0, 2) + '00';
    const year2 = () => date().substr(2, 2);
    const month = () => parseInt(date().substr(5, 2)).toString();
    const day = () => parseInt(date().substr(8, 2)).toString();
    const leap = () => ((year4() % 4 == 0) && (year4() % 100 != 0)) || (year4() % 400 == 0);

    const isCentury = createSelector(century);
    const isMonth = createSelector(month);

    const century_offset = () => CENTURY[century()];
    const year_offset = () => year2() % 7;
    const leap_year_offset = () => Math.floor(year2() / 4);
    const year_offset_final = () => century_offset() + year_offset() + leap_year_offset();
    const doomsday = () => year_offset_final() % 7;
    const isDay = createSelector(doomsday);

    const month_day = (m) => (leap() ? MONTH_LEAP : MONTH)[m];
    const month_offset = () => day() - month_day(month());
    const month_offset_final = () => (28 + month_offset()) % 7;

    const total = () => doomsday() + month_offset_final();

    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <h1>Doomsday algorithm date calculator</h1>
                <p>See <a href="https://en.wikipedia.org/wiki/Doomsday_rule">Wikipedia</a> for more details.</p>
            </header>
            <ol>
                <li class={styles.input}>
                    Enter date:
                    {' '}
                    <input class={styles.date_input}
                           type="date" value={date()}
                           onchange={(e) => setDate(e.srcElement.value)} />
                </li>

                <Show when={date()}>
                    <li>
                        Get century anchor day
                        <table>
                            <tbody>
                                <For each={Object.keys(CENTURY)}>
                                    {(c) => <tr classList={{[styles.selected]: isCentury(c)}}>
                                                <th>
                                                    <Show when={isCentury(c)} fallback={c}>
                                                        <span class={styles.date_input}>{c}</span>
                                                    </Show>
                                                </th>
                                                <td>{DAY[CENTURY[c]]}</td>
                                                <td style="background-color: white;">
                                                    <Show when={isCentury(c)} fallback={CENTURY[c]}>
                                                        <span class={styles.selected_century}>{CENTURY[c]}</span>
                                                    </Show>
                                                </td>
                                            </tr>}
                                </For>
                            </tbody>
                        </table>
                    </li>

                    <li>
                        Get year anchor day

                        <p>
                            Year
                            {' → '}
                            <span class={styles.date_input}>{year2()}</span>
                            {' % '}
                            <span class={styles.intermediate3}>
                                7
                            </span>
                            {' → '}
                            <span class={styles.intermediate}>{year_offset()}</span>
                        </p>
                        <p>
                            Leap year
                            {' → '}
                            <span class={styles.date_input}>{year2()}</span>
                            {' / '}
                            <span class={styles.intermediate3}>
                                4
                            </span>
                            <Show when={leap_year_offset() >= 7}>
                                {' → '}
                                <span class={styles.intermediate3}>
                                    {leap_year_offset()}
                                </span>
                            </Show>
                            {' → '}
                            <span class={styles.intermediate}>{leap_year_offset() % 7}</span>
                        </p>
                        <p>
                            {' → '}
                            <span class={styles.selected_century}>
                                {CENTURY[century()]}
                            </span>
                            {' + '}
                            <span class={styles.intermediate}>{year_offset()}</span>
                            {' + '}
                            <span class={styles.intermediate}>{leap_year_offset() % 7}</span>
                            <Show when={year_offset_final() >= 7}>
                                {' → '}
                                <span class={styles.intermediate3}>
                                    {year_offset_final()}
                                </span>
                            </Show>
                            {' → '}
                            <span class={styles.selected_day}>
                                {doomsday()}
                            </span>
                        </p>
                    </li>

                    <li>
                        Doomsdays are on
                        <table>
                            <tbody>
                                <For each={Object.keys(DAY)}>
                                    {(d) => <tr classList={{[styles.selected]: isDay(+d)}}>
                                                <th>
                                                    <Show when={isDay(+d)} fallback={d}>
                                                        <span class={styles.selected_day}>{d}</span>
                                                    </Show>
                                                </th>
                                                <td>{DAY[d]}</td>
                                            </tr>}
                                </For>
                            </tbody>
                        </table>
                    </li>

                    <li>
                        Get doomsday date for month
                        <table>
                            <tbody>
                                <For each={Object.keys(MONTH_NAME)}>
                                    {(m) => <tr classList={{[styles.selected]: isMonth(m)}}>
                                                <td>
                                                    <Show when={isMonth(m)} fallback={month_day(m)}>
                                                        <span class={styles.selected_month}>{month_day(m)}</span>
                                                    </Show>
                                                </td>
                                                <td>
                                                    <Show when={isMonth(m)} fallback={MONTH_NAME[m]}>
                                                        <span class={styles.date_input}>{MONTH_NAME[m]}</span>
                                                    </Show>
                                                </td>
                                                <td>{MNEMONIC[m]}</td>
                                            </tr>}
                                </For>
                            </tbody>
                        </table>
                    </li>

                    <li>
                        Number of days to doomsday
                        <p>
                            <span class={styles.date_input}>{day()}</span>
                            {' - '}
                            <span class={styles.selected_month}>
                                {month_day(month())}
                            </span>
                            {' → '}
                            <span class={styles.intermediate3}>
                                {month_offset()}
                            </span>
                            {' → '}
                            <span class={styles.intermediate2}>
                                {month_offset_final()}
                            </span>
                        </p>
                    </li>

                    <li>
                        <span class={styles.date_input}>
                            {day()} {MONTH_NAME[month()]} {year4()}
                        </span>
                        is on
                        <p>
                            <span class={styles.selected_day}>
                                {DAY[doomsday()]}
                            </span>
                            {' + '}
                            <span class={styles.intermediate2}>
                                {month_offset_final()}
                            </span>
                            {' → '}
                            {' '}
                            <b class={styles.result}>
                                {DAY[total() % 7]}
                            </b>
                        </p>
                    </li>
                </Show>
            </ol>

            <footer>
                <p>
                    <span style="font-size:0.9em;">Copyright &copy; 2022</span>
                    {' '}
                    <a href="https://tompaton.com/">tompaton.com</a>
                </p>
            </footer>
        </div>
    );
}

export default App;
