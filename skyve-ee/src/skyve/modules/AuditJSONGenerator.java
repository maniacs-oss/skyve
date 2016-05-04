package modules;

import java.util.Map;
import java.util.TreeMap;

import org.skyve.domain.Bean;
import org.skyve.domain.PersistentBean;
import org.skyve.impl.bind.BindUtil;
import org.skyve.impl.util.BeanVisitor;
import org.skyve.impl.util.JSONUtil;
import org.skyve.metadata.customer.Customer;
import org.skyve.metadata.model.Attribute;
import org.skyve.metadata.model.document.Document;
import org.skyve.metadata.model.document.Relation;

public class AuditJSONGenerator extends BeanVisitor {
	private Map<String, Object> audit = new TreeMap<>();
	private Customer customer;
	
	public AuditJSONGenerator(Customer customer) {
		super(false, false, false);
		this.customer = customer;
	}
	
	public String toJSON() throws Exception {
		return JSONUtil.marshall(customer, audit, null);
	}

	@Override
	protected boolean accept(String binding,
								Document document,
								Document owningDocument,
								Relation owningRelation,
								Bean bean)
	throws Exception {
		if (! document.isAudited()) {
			return false;
		}
		if ((owningRelation != null) && (! owningRelation.isAudited())) {
			return false;
		}

		Map<String, Object> node = new TreeMap<>();

		node.put(Bean.DOCUMENT_ID, bean.getBizId());
		
		for (Attribute attribute : document.getAllAttributes()) {
			// Is audited and is not a relation
			if (attribute.isAudited() && (! (attribute instanceof Relation))) {
				String name = attribute.getName();
				node.put(name, BindUtil.getSerialized(customer, bean, name));
			}
		}

		if (bean instanceof PersistentBean) {
			node.put(Bean.BIZ_KEY, ((PersistentBean) bean).getBizKey());
		}
		
		audit.put(binding, node);
		
		return true;
	}
}