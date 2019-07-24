SKYVE.PF = function() {
	// block multiple load attempts of google maps JS libs.
	var loadingGMap = false;

	// public
	return {
		getById: function(id) {
			return $(PrimeFaces.escapeClientId(id));
		},
		
		contentOverlayOnShow: function(id, url) {
			SKYVE.PF.getById(id + '_iframe').attr('src', url);
		},
		
		contentOverlayOnHide: function(id) {
			SKYVE.PF.getById(id + '_iframe').attr('src','')
		},
		
		afterContentUpload: function(binding, contentId, modoc, fileName) {
			top.$('[id$="_' + binding + '"]').val(contentId);
			var url = 'content?_n=' + contentId + '&_doc=' + modoc + '&_b=' + binding.replace(/\_/g, '.');
			top.$('[id$="_' + binding + '_link"]').attr('href', url).text(fileName);
			top.$('[id$="_' + binding + '_image"]').attr('src', url);
			top.PF(binding + 'Overlay').hide();
		},
		
		clearContentImage: function(binding) {
			$('[id$="_' + binding + '"]').val('');
			$('[id$="_' + binding + '_image"]').attr('src','images/blank.gif');
		},
		
		clearContentLink: function(binding) {
			$('[id$="_' + binding + '"]').val('');
			$('[id$="_' + binding + '_link"]').attr('href','javascript:void(0)').text('<Empty>');
		},
		
		getTextElement: function(id) {
			return SKYVE.PF.getById(id);
		},

		getTextValue: function(id) {
			return SKYVE.PF.getTextElement(id).val();
		},
		
		setTextValue: function(id, value) {
			SKYVE.PF.getTextElement(id).val(value);
		},

		getPasswordElement: function(id) {
			return SKYVE.PF.getById(id + 'password');
		},
		
		getPasswordValue: function(id) {
			return SKYVE.PF.getPasswordElement(id).val();
		},
		
		setPasswordValue: function(id, value) {
			SKYVE.PF.getPasswordElement(id).val(value);
		},

		// for selecting values and getting the selected value, use the PF SelectOneMenu API through widgetVar
		getComboElement: function(id) {
			return SKYVE.PF.getById(id);
		},

		// to perform a lookup, use the AutoComplete API through widgetVar
		getLookupElement: function(id) {
			return SKYVE.PF.getById(id);
		},
		
		getLookupValue: function(id) {
			return SKYVE.PF.getById(id + '_hinput').val();
		},
		
		setLookupValue: function(id, value) {
			SKYVE.PF.getById(id + '_hinput').val(value);
		},
		
		getLookupDescription: function(id) {
			return SKYVE.PF.getById(id + '_input').val();
		},
		
		setLookupDescription: function(id, value) {
			SKYVE.PF.getById(id + '_input').val(value);
		},
		
		getCheckboxElement: function(id) {
			return SKYVE.PF.getById(id);
		},
		
		getCheckboxValue: function(id) {
			var value = SKYVE.PF.getById(id + '_input').val();
			if (value == '0') {
				return null;
			}
			else if (value == '1') {
				return true;
			}
			else if (value == '2') {
				return false;
			}
			else {
				return SKYVE.PF.getById(id + '_input').is(":checked");
			}
		},
		
		setCheckboxValue: function(id, trueOrFalse) {
			SKYVE.PF.getById(id + '_input').prop('checked', trueOrFalse);

			var outerDiv = SKYVE.PF.getById(id);
			var innerDiv = outerDiv.find('.ui-chkbox-box');
			var innerSpan = innerDiv.find('.ui-chkbox-icon')
			if (trueOrFalse) {
				innerDiv.addClass('ui-state-active');
				innerSpan.addClass('ui-icon ui-icon-check')
			}
			else {
				innerDiv.removeClass('ui-state-active');
				innerSpan.removeClass('ui-icon ui-icon-check')
			}
		},

        toggleFilters: function(dataTableId) {
            var hiddenClass = 'hiddenFilter';
            // test for element that ends with the dataTableId as it may be in a naming container
            var dataTable = $('[id$="' + dataTableId + '"]');
			if (dataTable != null) {
				var toggleClass = function() {
                    var filter = $(this);
                    if (filter.hasClass(hiddenClass)) {
                        filter.removeClass(hiddenClass);
                    } else {
                        filter.addClass(hiddenClass);
                    }
				};
				dataTable.find('.ui-filter-column').each(toggleClass);
				dataTable.find('.ui-column-customfilter').each(toggleClass);
			}
		},
		
		onPushMessage: function(pushMessage) {
			var growls = [];

			for (var i = 0, l = pushMessage.length; i < l; i++) {
				var m = pushMessage[i];
				if (m.type == 'g') {
					growls.push({severity: m.severity, summary: m.message});
				}
				else if (m.type == 'm') {
					alert(m.message);
				}
				else if (m.type == 'r') {
					pushRerender();
				}
				else if (m.type == 'j') {
					window[m.method](m.argument);
				}
			}
			
			if (growls.length > 0) {
				PrimeFaces.cw('Growl', 'pushGrowl', {
					id: 'pushGrowl', 
					widgetVar: 'pushGrowl',
					life: 6000, 
					sticky: false, 
					msgs: growls 
				});
			}
		},
		
		gmap: function(options) {
			if (loadingGMap) {
				setTimeout(function() {SKYVE.PF.gmap(options)}, 100);
			}
			else if (window.google && window.google.maps && window.SKYVE.BizMapPicker) {
				if (options.queryName || options.modelName) {
					return SKYVE.BizMap.create(options);
				}
				return SKYVE.BizMapPicker.create(options);
			}
			else {
				loadingGMap = true;

				SKYVE.Util.loadJS('wicket/wicket.js?v=' + SKYVE.Util.v, function() {
					SKYVE.Util.loadJS('wicket/wicket-gmap3.js?v=' + SKYVE.Util.v, function() {
						var url = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing';
						if (SKYVE.Util.googleMapsV3ApiKey) {
							url += '&key=' + SKYVE.Util.googleMapsV3ApiKey;
						}
						SKYVE.Util.loadJS(url, function() {
							SKYVE.Util.loadJS('prime/skyve-gmap-min.js?v=' + SKYVE.Util.v, function() {
								loadingGMap = false;
								if (options.queryName || options.modelName) {
									return SKYVE.BizMap.create(options);
								}
								return SKYVE.BizMapPicker.create(options);
							});
						});
					});
				});
			}
		}
	};
}();
