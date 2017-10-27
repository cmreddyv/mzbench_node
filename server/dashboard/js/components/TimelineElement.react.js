import React from 'react';
import moment from 'moment';

import RelativeDate from './RelativeDate.react';
import MZBenchActions from '../actions/MZBenchActions';
import Star from './Star.react';
import MZBenchRouter from '../utils/MZBenchRouter';
import GlobalStore from '../stores/GlobalStore';
import PropTypes from 'prop-types';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

class TimelineElement extends React.Component {
    render() {
        if (GlobalStore.isDashboardModeOn()) {
            return this.renderDashboard();
        } else {
            return this.renderBench();
        }
    }
    renderDashboard() {
        let item = this.props.bench;
        let isSelected = this.props.isSelected;

        let cssClass = "bs bs-progress";

        if (isSelected) {
            cssClass += " bs-selected";
        }

        return (
            <a href={`#/dashboard/${item.id}/overview`} className="bs-link">
                <div className={cssClass}>
                    <h6 className="no-overflow">
                        #{item.id} {item.name}
                    </h6>
                </div>
            </a>
        );
    }
    renderBench() {
        let { bench, isSelected, duration } = this.props;

        let cssClass = "bs bs-" + (bench.isRunning() ? "progress" :  bench.status);

        if (isSelected) {
            cssClass += " bs-selected";
        }

        var tags = bench.tags.length <= 0 ? [] :
                <div className="timeline-tags no-overflow">
                {bench.tags.map(
                    (t, i) => {
                        return <span key={i}>
                                <span className={isSelected?"timeline-tag-link-selected":"timeline-tag-link"}
                                      onClick={(e) => { return this._onTagClick(t, e) }} key={i}>{"#"+t}
                                </span>
                                &nbsp;
                               </span>
                    })}
                </div>;

        let author = null;

        if (bench.author != "anonymous") {
            if (bench.author_name == "") {
                author = (<div>by {bench.author}</div>);
            } else {
                author = (<div>by {bench.author_name}</div>);
            }
        }

        const searchTooltip = <Tooltip id="search-tooltip">Search for similar benchmarks</Tooltip>;

        return (
            <a href={`#/bench/${bench.id}/overview`} className="bs-link">
                <div className={cssClass}>
                    <h6 className="no-overflow">
                        <Star selected={bench.tags.indexOf("favorites") > -1} onClick={(v) => {
                                if (v == true) MZBenchActions.addBenchTag(bench.id, "favorites");
                                else MZBenchActions.removeBenchTag(bench.id, "favorites");
                            }}/>
                        #{bench.id} {bench.name}
                        {bench.isRunning() ? <span className="label">{bench.status}</span> : null}
                        <OverlayTrigger delay={200} placement="top" overlay={searchTooltip}>
                            <span className="search-bench-character glyphicon glyphicon-search" aria-hidden="true"
                                onClick={(e) => {
                                    e.preventDefault();
                                    MZBenchRouter.navigate("/timeline", {q: bench.name});
                                }}/>
                        </OverlayTrigger>
                    </h6>
                    {tags}
                    <div><i className="glyphicon glyphicon-calendar"></i> <RelativeDate date = {bench.create_time_client} /></div>
                    <div><i className="glyphicon glyphicon-time"></i> {moment.duration(duration).humanize()}</div>
                    {author}
                </div>
            </a>
        );
    }

    _onTagClick(tag, event) {
        event.preventDefault();
        MZBenchRouter.navigate("/timeline", {q: "#"+tag});
    }

    _onClick() {
        MZBenchActions.selectBenchById(this.props.bench.id);
    }
}

TimelineElement.propTypes = {
    bench: PropTypes.object.isRequired,
    isSelected: PropTypes.bool
};

TimelineElement.defaultProps = {
    isSelected: false
};

export default TimelineElement;
