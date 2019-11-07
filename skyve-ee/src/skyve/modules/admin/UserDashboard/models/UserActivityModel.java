package modules.admin.UserDashboard.models;

import org.skyve.CORE;
import org.skyve.metadata.SortDirection;
import org.skyve.metadata.user.DocumentPermissionScope;
import org.skyve.metadata.view.model.chart.ChartBuilder;
import org.skyve.metadata.view.model.chart.ChartData;
import org.skyve.metadata.view.model.chart.ChartModel;
import org.skyve.metadata.view.model.chart.OrderBy;
import org.skyve.metadata.view.model.chart.TemporalBucket;
import org.skyve.metadata.view.model.chart.TemporalBucket.TemporalBucketType;
import org.skyve.persistence.DocumentQuery;
import org.skyve.persistence.Persistence;
import org.skyve.persistence.DocumentQuery.AggregateFunction;

import modules.admin.ModulesUtil;
import modules.admin.domain.Audit;
import modules.admin.domain.UserDashboard;

public class UserActivityModel extends ChartModel<UserDashboard> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4775794889575080733L;

	@Override
	public ChartData getChartData() {
		
		Persistence pers= CORE.getPersistence();
		
		// temporarily elevate user to be able to see Audit records in case they don't usually have access
		pers.setDocumentPermissionScopes(DocumentPermissionScope.global);
		
		DocumentQuery q = pers.newDocumentQuery(Audit.MODULE_NAME, Audit.DOCUMENT_NAME);
		q.getFilter().addEquals(Audit.userNamePropertyName, ModulesUtil.currentAdminUser().getUserName());

		ChartBuilder cb = new ChartBuilder();
		cb.with(q);
		cb.category(Audit.timestampPropertyName, new TemporalBucket(TemporalBucketType.dayMonthYear));
		cb.value(Audit.userNamePropertyName, AggregateFunction.Count);
		cb.top(14, OrderBy.category, SortDirection.descending, false);
		cb.orderBy(OrderBy.category, SortDirection.ascending);
		
		ChartData chartData = cb.build("My Activity","Activity - last 14 days");
		
		pers.resetDocumentPermissionScopes();
		
		return chartData;
	}

}