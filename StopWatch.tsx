import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';

// Components
function Timer({ interval, style }) {
    // padding 0 before number < 10
    const format = (n) => (n < 10 ? '0' + n : n);
    const duration = moment.duration(interval);
    const centiseconds = Math.floor(duration.milliseconds() / 10);
    return (
        <View style={styles.timerContainer}>
            <Text style={style}>{format(duration.minutes())}:</Text>
            <Text style={style}>{format(duration.seconds())},</Text>
            <Text style={style}>{format(centiseconds)}</Text>
        </View>
    );
}

function RoundButton({ title, color, background, onPress, disabled }) {
    // when no timer lap button cant be pressed
    const handlePress = () => {
        if (!disabled) {
            onPress();
        }
    };

    const buttonStyle = {
        backgroundColor: background,
        opacity: disabled ? 1.0 : 0.7,
    };

    const buttonTitleStyle = {
        color: color,
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.button, buttonStyle]}
            activeOpacity={1.0}
        >
            <View style={styles.buttonBorder}>
                <Text style={[styles.buttonTitle, buttonTitleStyle]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}


function Lap({ number, interval, fastest, slowest }) {
    const lapTextStyle = [
        styles.lapText,
        fastest ? styles.fastest : null,
        slowest ? styles.slowest : null,
    ];

    return (
        <View style={styles.lap}>
            <Text style={lapTextStyle}>Lap {number}</Text>
            <Timer style={[lapTextStyle, styles.lapTimer]} interval={interval} />
        </View>
    );
}

function LapsList({ laps, timer }) {
    const finishedLaps = laps.slice(1);
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    if (finishedLaps.length >= 2) {
        finishedLaps.forEach((lap) => {
            if (lap < min) min = lap;
            if (lap > max) max = lap;
        });
    }
    return (
        <ScrollView style={styles.scrollView}>
            {laps.map((lap, index) => (
                <Lap
                    number={laps.length - index}
                    key={laps.length - index}
                    interval={index === 0 ? timer + lap : lap}
                    fastest={lap === min}
                    slowest={lap === max}
                />
            ))}
        </ScrollView>
    );
}

export default class StopWatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            now: 0,
            laps: [],
        };
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startHandle = () => {
        const now = new Date().getTime();
        this.setState({
            start: now,
            now,
            laps: [0],
        });
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() });
        }, 100);
    };

    lapHandle = () => {
        const timestamp = new Date().getTime();
        const { laps, now, start } = this.state;
        const [firstLap, ...other] = laps;
        this.setState({
            laps: [0, firstLap + now - start, ...other],
            start: timestamp,
            now: timestamp,
        });
    };

    stopHandle = () => {
        clearInterval(this.timer);
        const { laps, now, start } = this.state;
        const [firstLap, ...other] = laps;
        this.setState({
            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0,
        });
    };

    resetHandle = () => {
        this.setState({
            laps: [],
            start: 0,
            now: 0,
        });
    };

    resumeHandle = () => {
        const now = new Date().getTime();
        this.setState({
            start: now,
            now,
        });
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() });
        }, 100);
    };

    render() {
        const { now, start, laps } = this.state;
        const timer = now - start;
        return (
            <View style={styles.container}>
                <Timer
                    // sum of all laps that is finished
                    interval={laps.reduce((total, curr) => total + curr, 0) + timer}
                    style={styles.timer}
                />
                {laps.length === 0 && (
                    <View style={styles.buttonRow}>
                        <RoundButton
                            title='Lap'
                            color='#8B8B90'
                            background='#151515'
                            disabled
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.startHandle}
                        />
                    </View>
                )}
                {start > 0 && (
                    <View style={styles.buttonRow}>
                        <RoundButton
                            title='Lap'
                            color='#FFFFFF'
                            background='#3D3D3D'
                            onPress={this.lapHandle}
                        />
                        <RoundButton
                            title='Stop'
                            color='#E33935'
                            background='#3C1715'
                            onPress={this.stopHandle}
                        />
                    </View>
                )}
                {laps.length > 0 && start === 0 && (
                    <View style={styles.buttonRow}>
                        <RoundButton
                            title='Reset'
                            color='#FFFFFF'
                            background='#3D3D3D'
                            onPress={this.resetHandle}
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.resumeHandle}
                        />
                    </View>
                )}
                <LapsList laps={laps} timer={timer} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        paddingTop: 130,
        paddingHorizontal: 40,
    },
    timer: {
        color: 'white',
        fontSize: 76,
        fontWeight: '200',
        width: 110,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        fontSize: 18,
    },
    buttonBorder: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: 80,
        marginBottom: 30,
    },
    lapText: {
        color: 'white',
        fontSize: 18,
    },
    lapTimer: {
        width: 30,
    },
    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#151515',
        borderTopWidth: 1,
        paddingVertical: 20,
    },
    scrollView: {
        alignSelf: 'stretch',
    },
    fastest: {
        color: '#4BC05F',
    },
    slowest: {
        color: '#CC3531',
    },
    timerContainer: {
        flexDirection: 'row',
    },
});
