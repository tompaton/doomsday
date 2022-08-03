import { createSignal, createSelector } from "solid-js";
import { For, Show } from "solid-js";
import styles from './App.module.css';


function App() {
    const [date, setDate] = createSignal(new Date().toISOString().substr(0, 10));
    const year4 = () => date().substr(0, 4);
    const century = () => date().substr(0, 2) + '00';
    const year2 = () => date().substr(2, 2);
    const month = () => parseInt(date().substr(5, 2)).toString();
    const day = () => parseInt(date().substr(8, 2)).toString();
    const leap = () => ((year4() % 4 == 0) && (year4() % 100 != 0)) || (year4() % 400 == 0);

    const century_offset = () => CENTURY[century()];
    const year_offset = () => year2() % 7;
    const leap_year_offset = () => Math.floor(year2() / 4);
    const year_offset_final = () => century_offset() + year_offset() + leap_year_offset();
    const doomsday = () => year_offset_final() % 7;

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
                        <CenturyTable selected={createSelector(century)} />
                    </li>

                    <li>
                        Get year anchor day

                        <p>
                            Year
                            {' → '}
                            <D>{year2()}</D>
                            {' % '}
                            <I3>7</I3>
                            {' → '}
                            <I1>{year_offset()}</I1>
                        </p>
                        <p>
                            Leap year
                            {' → '}
                            <D>{year2()}</D>
                            {' / '}
                            <I3>4</I3>
                            <Show when={leap_year_offset() >= 7}>
                                {' → '}
                                <I3>{leap_year_offset()}</I3>
                            </Show>
                            {' → '}
                            <I1>{leap_year_offset() % 7}</I1>
                        </p>
                        <p>
                            {' → '}
                            <S1>{century_offset()}</S1>
                            {' + '}
                            <I1>{year_offset()}</I1>
                            {' + '}
                            <I1>{leap_year_offset() % 7}</I1>
                            <Show when={year_offset_final() >= 7}>
                                {' → '}
                                <I3>{year_offset_final()}</I3>
                            </Show>
                            {' → '}
                            <S3>{doomsday()}</S3>
                        </p>
                    </li>

                    <li>
                        Doomsdays are on
                        <DayTable selected={createSelector(doomsday)} />
                    </li>

                    <li>
                        Get doomsday date for month
                        <MonthTable month_day={month_day}
                                    selected={createSelector(month)} />
                    </li>

                    <li>
                        Number of days to doomsday
                        <p>
                            <D>{day()}</D>
                            {' - '}
                            <S2>{month_day(month())}</S2>
                            <Show when={month_offset() < 0 || month_offset() >= 7}>
                                {' → '}
                                <I3>{month_offset()}</I3>
                            </Show>
                            {' → '}
                            <I2>{month_offset_final()}</I2>
                        </p>
                    </li>

                    <li>
                        <D>{day()} {MONTH_NAME[month()]} {year4()}</D>
                        is on
                        <p>
                            <S3>{DAY[doomsday()]}</S3>
                            {' + '}
                            <I2>{month_offset_final()}</I2>
                            {' → '}
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


const CENTURY = {
    1800: 5,
    1900: 3,
    2000: 2,
    2100: 0,
    2200: 5,
    2300: 3,
};

function CenturyTable(props) {
    return (
        <table>
            <tbody>
                <For each={Object.keys(CENTURY)}>
                    {(c) => <tr classList={{[styles.selected]: props.selected(c)}}>
                                <th>
                                    <Show when={props.selected(c)} fallback={c}>
                                        <D>{c}</D>
                                    </Show>
                                </th>
                                <td>{DAY[CENTURY[c]]}</td>
                                <td style="background-color: white;">
                                    <Show when={props.selected(c)} fallback={CENTURY[c]}>
                                        <S1>{CENTURY[c]}</S1>
                                    </Show>
                                </td>
                            </tr>}
                </For>
            </tbody>
        </table>
    );
}


const DAY = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};

function DayTable(props) {
    return (
        <table>
            <tbody>
                <For each={Object.keys(DAY)}>
                    {(d) => <tr classList={{[styles.selected]: props.selected(+d)}}>
                                <th>
                                    <Show when={props.selected(+d)} fallback={d}>
                                        <S3>{d}</S3>
                                    </Show>
                                </th>
                                <td>{DAY[d]}</td>
                            </tr>}
                </For>
            </tbody>
        </table>
    );
}


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

function MonthTable(props) {
    return (
        <table>
            <tbody>
                <For each={Object.keys(MONTH_NAME)}>
                    {(m) => <tr classList={{[styles.selected]: props.selected(m)}}>
                                <td>
                                    <Show when={props.selected(m)} fallback={props.month_day(m)}>
                                        <S2>{props.month_day(m)}</S2>
                                    </Show>
                                </td>
                                <td>
                                    <Show when={props.selected(m)} fallback={MONTH_NAME[m]}>
                                        <D>{MONTH_NAME[m]}</D>
                                    </Show>
                                </td>
                                <td>{MNEMONIC[m]}</td>
                            </tr>}
                </For>
            </tbody>
        </table>
    );
}


// short tags to reduce markup required to highlight related values

function D(props) {
    return (
        <span class={styles.date_input}>{props.children}</span>
    );
}

function S1(props) {
    return (
        <span class={styles.selected_century}>{props.children}</span>
    );
}

function S2(props) {
    return (
        <span class={styles.selected_month}>{props.children}</span>
    );
}

function S3(props) {
    return (
        <span class={styles.selected_day}>{props.children}</span>
    );
}

function I1(props) {
    return (
        <span class={styles.intermediate}>{props.children}</span>
    );
}

function I2(props) {
    return (
        <span class={styles.intermediate2}>{props.children}</span>
    );
}

function I3(props) {
    return (
        <span class={styles.intermediate3}>{props.children}</span>
    );
}

export default App;
